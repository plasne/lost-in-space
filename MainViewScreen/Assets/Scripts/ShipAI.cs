using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShipAI : MonoBehaviour
{

    public GameObject PlayerShip { get; set; }
    public GameObject Features { get; set; }
    public Rigidbody Rigidbody { get; set; }

    public string FlightDirective { get; set; } = "close";
    public string InteractDirective { get; set; } = "attack";

    private GameObject Target { get; set; }
    private Vector3? Waypoint { get; set; }
    private float Elapsed { get; set; }

    void Start()
    {

        // get references
        PlayerShip = Resources.FindObjectsOfTypeAll<Player>().First().gameObject;
        Features = GameObject.Find("Features");
        Rigidbody = GetComponentInChildren<Rigidbody>();

        // assign target
        Target = PlayerShip;

    }

    void Update()
    {

        // every few seconds figure out the target, waypoint
        Elapsed += Time.deltaTime;
        if (Elapsed > 1.0f)
        {
            Elapsed = 0.0f;
            if (Target != null) CheckForObstructions();
        }

    }

    private List<(GameObject, float)> GetForwardFacingContactPoints()
    {
        List<(GameObject, float)> contactPoints = new List<(GameObject, float)>();
        for (int i = 0; i < transform.childCount; i++)
        {
            GameObject obj = transform.GetChild(i).gameObject;
            switch (obj.name)
            {
                case "contactFore":
                    contactPoints.Add((obj, 0.0f));
                    break;
                case "contactLeft":
                    contactPoints.Add((obj, -2.0f));
                    break;
                case "contactRight":
                    contactPoints.Add((obj, 2.0f));
                    break;
            }
        }
        return contactPoints;
    }

    private GameObject CheckLine(Vector3 point, Vector3 direction, float distance)
    {
        var hits = Physics.RaycastAll(point, direction, distance);
        var pp = new Ray(point, direction).GetPoint(distance);
        //Debug.DrawLine(point, pp, Color.green, 5.0f);
        foreach (var hit in hits)
        {
            if (hit.transform.gameObject.name == this.name)
            {
                // ignore self
            }
            else if (hit.transform.gameObject == Target)
            {
                // hit target
                return Target;
            }
            else
            {
                // hit something else
                return hit.collider.gameObject;
            }
        }
        return null;
    }

    private void CheckForObstructions()
    {

        // look for obstructions
        var contactPoints = GetForwardFacingContactPoints();
        foreach (var contactPoint in contactPoints)
        {
            (GameObject obj, float tilt) = contactPoint;
            var direction = obj.transform.forward;
            direction = Quaternion.AngleAxis(tilt, Vector3.up) * direction;
            var col = CheckLine(obj.transform.position, direction, 10000.0f);
            if (col != null)
            {
                // pick a waypoint
                FindWaypoint(10.0f);
                return;
            }
        }

        // if there is a way to the target, abandon the waypoint, unless it is too close
        if (Waypoint != null)
        {
            var distance = Vector3.Distance(transform.position, Target.transform.position);
            if (distance > 5000.0f)
            {
                var direction = Target.transform.position - transform.position;
                var col = CheckLine(transform.position, direction, 100000.0f);
                if (col == Target) Waypoint = null;
            }
        }

        // if there is still a waypoint, set a new one further out
        if (Waypoint != null)
        {
            var direction = (Vector3)Waypoint - transform.position;
            var col = CheckLine(transform.position, direction, 10000.0f);
            if (col == null) Waypoint = new Ray(transform.position, direction).GetPoint(10000.0f);
        }

    }

    private Vector3? FindWaypoint(Vector3 direction)
    {
        var distance = 10000.0f;
        var obj = CheckLine(transform.position, direction, distance);
        if (obj != null && obj != Target) return null;
        var ray = new Ray(transform.position, direction);
        var point = ray.GetPoint(distance);
        //Debug.DrawLine(transform.position, point, Color.red, 5.0f);
        return point;
    }

    private void FindWaypoint(float angle)
    {

        // baseline
        var baseline = transform.forward;

        // test negative
        var neg = Quaternion.Euler(0, -angle, 0) * baseline;
        var negresult = FindWaypoint(neg);
        if (negresult != null)
        {
            Waypoint = negresult;
            return;
        }

        // test positive
        var pos = Quaternion.Euler(0, angle, 0) * baseline;
        var posresult = FindWaypoint(pos);
        if (posresult != null)
        {
            Waypoint = posresult;
            return;
        }

        // recursive
        angle += 10.0f;
        if (angle <= 180.0f) FindWaypoint(angle);

    }

    void FixedUpdate()
    {

        float agility = 1.0f * Time.deltaTime;
        float speed = 1000000.0f * Time.deltaTime;

        // fly the appropriate direction
        if (Waypoint != null)
        { // rotate towards the waypoint
            Vector3 direction = (Vector3)Waypoint - transform.position;
            Vector3 max = Vector3.RotateTowards(transform.forward, direction, agility, 0.0f);
            Debug.DrawRay(transform.position, max * 1000.0f, Color.blue);
            Quaternion rotation = Quaternion.LookRotation(max, Vector3.up);
            transform.rotation = rotation;
        }
        else if (Target != null)
        { // rotate towards the target
            Vector3 direction = Target.transform.position - transform.position;
            Vector3 max = Vector3.RotateTowards(transform.forward, direction, agility, 0.0f);
            Debug.DrawRay(transform.position, max * 1000.0f, Color.yellow);
            Quaternion rotation = Quaternion.LookRotation(max, Vector3.up);
            transform.rotation = rotation;
        }

        // apply main thrust
        Rigidbody.AddRelativeForce(new Vector3(0.0f, 0.0f, speed), ForceMode.Force);

    }

}

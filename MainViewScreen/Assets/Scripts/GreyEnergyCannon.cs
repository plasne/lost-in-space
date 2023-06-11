using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GreyEnergyCannon : MonoBehaviour
{

    public GameObject Target { get; set; }
    public Collider[] SelfColliders { get; set; }

    private float Elapsed { get; set; } = 20.0f;

    private float FiringArc { get; set; } = 15.0f;
    private float ChargeTime { get; set; } = 10.0f;
    private int RateOfFire { get; set; } = 3;
    private float Range { get; set; } = 10000.0f;

    void Start()
    {
        Target = Resources.FindObjectsOfTypeAll<Player>().First().gameObject;
        SelfColliders = transform.parent.GetComponentsInChildren<Collider>();
    }

    private GameObject CheckLine(Vector3 point, Vector3 direction, float distance)
    {
        var hits = Physics.RaycastAll(point, direction, distance);
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

    private GameObject ClosestContactPointOnTarget()
    {
        var shortest = float.MaxValue;
        GameObject contactPoint = null;
        for (int i = 0; i < Target.transform.childCount; i++)
        {
            var child = Target.transform.GetChild(i).gameObject;
            if (child.tag == "Contact")
            {
                var distance = Vector3.Distance(transform.position, child.transform.position);
                if (distance < shortest)
                {
                    shortest = distance;
                    contactPoint = child;
                }
            }
        }
        return contactPoint;
    }

    IEnumerator FireCannonEnum(GameObject contactPoint)
    {

        // get the templates
        GameObject ball_template = (GameObject)Resources.Load("Models/cannonball", typeof(GameObject));
        //string effect = effects.effect;
        //GameObject effect_template = string.IsNullOrEmpty(effect) ? null : (GameObject)Resources.Load("Models/" + effect, typeof(GameObject));

        // lock in the target position (just in case the actual target is destroyed by previous balls)
        Vector3 targetPos = contactPoint.transform.position;

        // keep track of used mounts
        List<GameObject> used_mounts = new List<GameObject>();

        // fire each round
        int count = 0;
        while (count < RateOfFire)
        {

            // instantiate
            GameObject ball_instance = (GameObject)Instantiate(ball_template);
            foreach (var collider in SelfColliders)
            {
                Physics.IgnoreCollision(ball_instance.GetComponent<Collider>(), collider);
            }
            //GameObject effect_instance = (effect_template == null) ? null : (GameObject)Instantiate(effect_template, mount.transform.position, mount.transform.rotation);

            // determine the velocity and start position
            float offset = Random.Range(-100.0f, 100.0f);
            Vector3 position = new Vector3(transform.position.x + offset, transform.position.y, transform.position.z);

            // enter play
            ball_instance.transform.position = position;
            ball_instance.transform.rotation = transform.rotation;
            if (FiringArc > 0.0f)
            {
                Vector3 full = targetPos - transform.position;
                Vector3 partial = Vector3.RotateTowards(transform.forward, full, Mathf.Deg2Rad * FiringArc / 2.0f, 0.0f);
                Ray ray = new Ray(transform.position, partial);
                var distance = Vector3.Distance(transform.position, contactPoint.transform.position);
                ball_instance.transform.LookAt(ray.GetPoint(distance));
                Debug.DrawRay(transform.position, partial * 5000.0f, Color.green, 1.0f);
            }

            // cannonball script actions
            Cannonball cannonball = ball_instance.GetComponent<Cannonball>();
            cannonball.OwnedByShip = GetComponentInParent<Ship>();

            // iterate
            count++;
            yield return new WaitForSeconds(0.25f);

        }

    }

    void Update()
    {
        Elapsed += Time.deltaTime;

        // if there is a target, and the weapon is charged
        if (Target != null && Elapsed >= ChargeTime)
        {
            // if in range
            var distance = Vector3.Distance(transform.position, Target.transform.position);
            if (distance <= Range)
            {
                // if the closest contact point is in the firing arc
                var contactPoint = ClosestContactPointOnTarget();
                Vector3 full = contactPoint.transform.position - transform.position;
                Vector3 partial = Vector3.RotateTowards(transform.forward, full, Mathf.Deg2Rad * FiringArc / 2.0f, 0.0f);
                var hit = CheckLine(transform.position, partial, Range);
                if (hit == Target)
                {
                    StartCoroutine(FireCannonEnum(contactPoint));
                    Elapsed = 0.0f;
                }
            }
        }

    }

}

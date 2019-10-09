using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System;

public abstract class GameObj : MonoBehaviour
{

    public bool IsInvulnerable { get; set; } = false;
    public float HullPoints { get; set; }
    public float Damage { get; set; }
    private bool IsDestroyed { get; set; }
    public Ship OwnedByShip { get; set; }

    public abstract string ExplosionPrefab { get; }

    private static List<Transform> FindChildrenByTag(Transform transform, string tag)
    {
        List<Transform> list = new List<Transform>();
        foreach (Transform t in transform.Cast<Transform>().ToList())
            list.AddRange(FindChildrenByTag(t, tag));
        if (transform.tag == tag)
            list.Add(transform);
        return list;
    }

    public List<GameObject> ContactPoints
    {
        get
        {
            List<GameObject> points = new List<GameObject>();
            List<Transform> transforms = FindChildrenByTag(transform, "Contact");
            if (transforms.Count > 0)
            {
                transforms.ForEach(t =>
                {
                    points.Add(t.gameObject);
                });
            }
            points.Add(gameObject); // + itself
            return points;
        }
    }

    public GameObject ClosestContactPointTo(Vector3 referencePoint)
    {

        // shortcut
        List<GameObject> points = ContactPoints;
        if (points.Count == 1) return points[0];

        // hold current closest
        float max = float.MaxValue;
        GameObject closest = null;

        // use magnitude because I think it is faster
        foreach (GameObject contactPoint in ContactPoints)
        {
            Vector3 direction = contactPoint.transform.position - referencePoint;
            float sqrMagnitude = direction.sqrMagnitude;
            if (sqrMagnitude < max)
            {
                max = sqrMagnitude;
                closest = contactPoint;
            }
        }

        return closest;
    }

    public struct ClosestContactPoints
    {
        public GameObject sourcePoint;
        public GameObject targetPoint;
        public float distance;
    }

    /// <summary>
    /// Checks each contact point on this ship versus each contact point on the far ship and
    /// returns the closest contact point on each ship.
    /// </summary>
    public ClosestContactPoints ClosestContactPointTo(GameObj target)
    {
        ClosestContactPoints points = new ClosestContactPoints
        {
            distance = float.MaxValue
        };

        // find the shortest distance
        foreach (GameObject sourceContactPoint in ContactPoints)
        {
            foreach (GameObject targetContactPoint in target.ContactPoints)
            {
                Vector3 direction = sourceContactPoint.transform.position - targetContactPoint.transform.position;
                float sqrMagnitude = direction.sqrMagnitude;
                if (sqrMagnitude < points.distance)
                {
                    points.sourcePoint = sourceContactPoint;
                    points.targetPoint = targetContactPoint;
                    points.distance = sqrMagnitude;
                }
            }
        }

        // calculate the distance
        points.distance = Vector3.Distance(points.sourcePoint.transform.position, points.targetPoint.transform.position);

        return points;
    }

    public bool IsAnyContactPointCloseEnough(Vector3 referencePoint, float sqrRange)
    {
        foreach (GameObject contactPoint in ContactPoints)
        {
            Vector3 direction = contactPoint.transform.position - referencePoint;
            float sqrDistance = direction.sqrMagnitude;
            if (sqrDistance <= sqrRange) return true;
        }
        return false;
    }

    public Bounds Bounds()
    {
        Bounds totalBounds = new Bounds(Vector3.zero, Vector3.zero);
        Renderer firstRenderer = GetComponent<Renderer>();
        if (firstRenderer)
        {
            totalBounds.Encapsulate(firstRenderer.bounds);
        }
        Renderer[] renderers = GetComponentsInChildren<Renderer>();
        foreach (Renderer renderer in renderers)
        {
            totalBounds.Encapsulate(renderer.bounds);
        }
        return totalBounds;
    }

    public float Size()
    {
        float max = 0.0f;
        Vector3 size = Bounds().size;
        if (size.x > max)
        {
            max = size.x;
        }
        if (size.y > max)
        {
            max = size.y;
        }
        if (size.z > max)
        {
            max = size.z;
        }
        return max;
    }

    public List<GameObject> Progeny()
    {
        List<GameObject> list = new List<GameObject>();

        // define the recursive function
        Action<Transform> recur = null;
        recur = (Transform current) =>
        {
            list.Add(current.gameObject);
            foreach (Transform child in current)
            {
                recur(child);
            }
        };

        // start
        recur(this.transform);

        return list;
    }

    public virtual void Explode(Vector3 position)
    {

        // show explosion
        GameObject explosion_template = (GameObject)Resources.Load("Models/" + ExplosionPrefab, typeof(GameObject));
        GameObject explosion_instance = (GameObject)Instantiate(explosion_template, position, Quaternion.identity);

        // destroy the object
        StartCoroutine(Destroy());

        // apply force and damage
        //Explosion script = explosion_instance.GetComponent<Explosion>();
        //script.Blast();

    }

    public IEnumerator Destroy()
    {
        IsDestroyed = true;
        yield return null; // replaces WaitForEndOfFrame()
        Destroy(gameObject);
    }

}

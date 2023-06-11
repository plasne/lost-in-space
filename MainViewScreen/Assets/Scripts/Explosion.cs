using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Explosion : MonoBehaviour
{

    private float t = 0.0f;
    private Light bright;

    public float maxIntensity;
    public float peakAt;
    public float dimAt;
    public float destroyAt;

    void Awake()
    {

        // find the light
        for (int i = 0; i < transform.childCount; i++)
        {
            Light l = transform.GetChild(i).GetComponent<Light>();
            if (l)
            {
                bright = l;
            }
        }

    }

    void Update()
    {
        t += Time.deltaTime * Time.timeScale;

        // brighten
        if (t <= peakAt)
        {
            bright.intensity = Mathf.Lerp(0.0f, maxIntensity, t / peakAt);
            bright.range = bright.intensity * 3;
        }

        // dim
        if (t > peakAt && t <= dimAt)
        {
            bright.intensity = Mathf.Lerp(maxIntensity, 0.0f, (t - peakAt) / (dimAt - peakAt));
            bright.range = bright.intensity * 3;
        }

        // destroy if at the end
        if (t >= destroyAt)
        {
            Destroy(gameObject);
        }

    }

    /*
        private class BlastContactPoint
        {
            public GameObject go;
            public Collider collider;
            public float sqrDistance = float.MaxValue;
            public Vector3 direction;
            public Vector3 impact;
        }

        private void Hit(BlastContactPoint bcp, Vector3 origin, float distance, BlastProfile profile, float multiplier = 1.0f)
        {
            GameObj obj = bcp.go.GetComponent<GameObj>();
            if (obj != null && profile.ignore != null && profile.ignore.Contains(obj))
            {
                // ignore this object
            }
            else
            {

                // apply force (NOTE: for some reason it looks better if the force isn't relative)
                Rigidbody body = bcp.go.GetComponent<Rigidbody>();
                if (body)
                {
                    // the force should be 100x weaker on ordinance because they have high velocity and low surface area
                    if (bcp.go.tag == "Ordinance")
                    {
                        body.AddForce(2.0f * bcp.direction.normalized * profile.force * multiplier);
                    }
                    else
                    {
                        body.AddForce(200.0f * bcp.direction.normalized * profile.force * multiplier);
                    }
                }

                // build a profile for the individual hit
                BlastProfile effectiveProfile = profile.Clone();
                if (profile.diminish)
                {
                    effectiveProfile.damage = profile.damage * (1.0f - (distance / profile.range)) * multiplier;
                }

                // if there is damage to apply
                if (effectiveProfile.damage > 0.0f)
                {

                    // position and direction
                    Ship.ShieldDir dir = new Ship.ShieldDir() { isPosition = true, vector = origin };

                    // apply damage
                    switch (bcp.collider.gameObject.tag)
                    {
                        case "ShieldFore":
                            Ship ship1 = bcp.collider.gameObject.transform.parent.gameObject.GetComponent<Ship>();
                            ship1.TakeDamage("front", effectiveProfile, bcp.impact, dir, 2.0f);
                            break;
                        case "ShieldAft":
                            Ship ship2 = bcp.collider.gameObject.transform.parent.gameObject.GetComponent<Ship>();
                            ship2.TakeDamage("rear", effectiveProfile, bcp.impact, dir, 2.0f);
                            break;
                        case "ShieldLeft":
                            Ship ship3 = bcp.collider.gameObject.transform.parent.gameObject.GetComponent<Ship>();
                            ship3.TakeDamage("left", effectiveProfile, bcp.impact, dir, 2.0f);
                            break;
                        case "ShieldRight":
                            Ship ship4 = bcp.collider.gameObject.transform.parent.gameObject.GetComponent<Ship>();
                            ship4.TakeDamage("right", effectiveProfile, bcp.impact, dir, 2.0f);
                            break;
                        case "Ordinance":
                        case "Obstacle":
                            obj.TakeDamage(effectiveProfile, bcp.impact, 2.0f);
                            break;
                    }

                }

            }
        }

        public void Blast(BlastProfile profile)
        {
            float sqrRange = profile.range * profile.range;

            // see what objects are within range
            Game game = GameObject.Find("Game").GetComponent<Game>();
            game.ObjectsInPlay.ForEach(go =>
            {
                GameObj obj = go.GetComponent<GameObj>();
                if (obj)
                {

                    if (profile.collider && profile.collider.transform.root.gameObject == go)
                    {

                        // the explosion was caused by a collision
                        Ray ray = new Ray(transform.position, profile.direction);
                        BlastContactPoint bcp = new BlastContactPoint()
                        {
                            go = go,
                            collider = profile.collider,
                            impact = ray.GetPoint(-1.0f),
                            direction = profile.direction
                        };
                        Hit(bcp, origin: ray.GetPoint(-20.0f), distance: 0.0f, profile: profile);

                    }
                    else
                    {

                        // see if any contact point is in range
                        if (obj.IsAnyContactPointCloseEnough(transform.position, sqrRange))
                        {

                            // see how many rays are unobstructed
                            int contactsMade = 0;
                            BlastContactPoint closest = new BlastContactPoint();
                            List<GameObject> contactPoints = obj.ContactPoints;
                            foreach (GameObject contactPoint in contactPoints)
                            {
                                Vector3 direction = contactPoint.transform.position - transform.position;
                                float sqrDistance = direction.sqrMagnitude;
                                Ray ray = new Ray(transform.position, direction);
                                List<RaycastHit> hits = new List<RaycastHit>();
                                hits.AddRange(Physics.RaycastAll(ray)); // REMOVED RANGE: , profile.range
                                hits.Sort((a, b) => a.distance.CompareTo(b.distance));
                                int count = 0;
                                //Debug.Log(count + ": going for " + obj.card.title);
                                foreach (RaycastHit hit in hits)
                                {
                                    count++;
                                    GameObject gameObject_hit = hit.collider.gameObject.transform.root.gameObject;
                                    GameObj gameObj_hit = gameObject_hit.GetComponent<GameObj>();
                                    if (profile.ignore != null && gameObj_hit && profile.ignore.Contains(gameObj_hit))
                                    {
                                        // ignore; this collision type is explicitly not allowed
                                        //Debug.Log(count + ": ignore with " + ((gameObj_hit != null) ? gameObj_hit.card.title : gameObject_hit.name));
                                    }
                                    else if (gameObject_hit.tag == "Ordinance" && gameObject_hit != go)
                                    {
                                        // ignore; ordinance should not block other things from being hit
                                        //Debug.Log(count + ": ignore ordinance");
                                    }
                                    else
                                    {
                                        if (gameObject_hit == go)
                                        {
                                            // it hit the object it was trying to hit (ie. unblocked)
                                            if (sqrDistance < closest.sqrDistance)
                                            {
                                                closest.go = go;
                                                closest.sqrDistance = sqrDistance;
                                                closest.collider = hit.collider;
                                                closest.impact = hit.point;
                                                closest.direction = direction;
                                            }
                                            contactsMade++;
                                            //Debug.Log(count + ": contact with " + ((gameObj_hit != null) ? gameObj_hit.card.title : gameObject_hit.name));
                                            //Debug.DrawRay(transform.position, direction, Color.green, 120.0f);
                                            break; // don't test further
                                        }
                                        else
                                        {
                                            // blocked
                                            //Debug.Log(count + ": blocked by " + ((gameObj_hit != null) ? gameObj_hit.card.title : gameObject_hit.name));
                                            //Debug.DrawRay(transform.position, direction, Color.red, 120.0f);
                                            break; // don't test further
                                        }
                                    }
                                }
                            }

                            // the object should take force and damage
                            if (contactsMade > 0)
                            {
                                float distance = Vector3.Distance(transform.position, closest.go.transform.position);
                                float percentage = (float)contactsMade / (float)contactPoints.Count;
                                //Debug.Log ("HIT: " + obj.card.title + " " + contactsMade + " / " + contactPoints.Count);
                                Hit(closest, origin: transform.position, distance: distance, profile: profile, multiplier: percentage);
                            }

                        }

                    }

                }
            });

        }

     */


}

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class Cannonball : Ordinance
{

    private Rigidbody Rigidbody { get; set; }

    private bool IsDestroyed { get; set; }
    private Collider DetonationCollider { get; set; }

    public override string ExplosionPrefab
    {
        get
        {
            return "explosion01";
        }
    }

    void Start()
    {
        Rigidbody = GetComponent<Rigidbody>();
    }

    void OnTriggerEnter(Collider collider)
    {

        // see what it collided with
        bool detonate = true;
        GameObject go = collider.gameObject.transform.root.gameObject;
        switch (go.tag)
        {
            case "Ship":
                // ignore collisions with the firing ship
                Ship ship = go.GetComponent<Ship>();
                if (ship == OwnedByShip) detonate = false;
                break;
            case "Ordinance":
                // ignore collisions with ordinance
                detonate = false;
                break;
            default:
                // detonate
                break;
        }

        // attempt to detonate
        if (detonate && DetonationCollider == null) DetonationCollider = collider;

    }

    void FixedUpdate()
    {
        if (!IsDestroyed)
        {

            // continue forward
            var speed = 200000.0f * Time.deltaTime;
            Rigidbody.AddRelativeForce(new Vector3(0.0f, 0.0f, speed), ForceMode.Force);

            // explode on update so that it can only happen once even if it collides with multiple colliders
            if (DetonationCollider != null)
            {

                // determine the contact point
                Ray ray = new Ray(transform.position, transform.forward);
                Vector3 position = transform.position;
                Vector3 from = ray.GetPoint(-2000.0f);

                // if this is a shield determine if it can absorb the hit
                switch (DetonationCollider.gameObject.tag)
                {
                    case "ShieldFore":
                    case "ShieldAft":
                    case "ShieldLeft":
                    case "ShieldRight":
                        {
                            Ship ship = DetonationCollider.gameObject.GetComponentInParent<Ship>();
                            position = ray.GetPoint(-ship.ShieldDistance);
                            ship.ShowShield(position, from);
                            break;
                        }
                    default:
                        break;
                }

                // explode
                DetonationCollider = null;
                Explode(position);

            }

        }
    }


}

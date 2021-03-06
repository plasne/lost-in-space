﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;

public class Player : MonoBehaviour
{

    private Network Network { get; set; }
    private Rigidbody Rigidbody { get; set; }

    private float Elapsed { get; set; }

    public float Speed { get; set; }
    public float Yaw { get; set; }
    public float Pitch { get; set; }

    void Start()
    {

        // get references
        Network = GameObject.Find("Game").GetComponent<Network>();
        Rigidbody = GetComponent<Rigidbody>();

    }

    void Update()
    {
    }

    void FixedUpdate()
    {
        Quaternion rotation = Rigidbody.transform.localRotation;

        // apply relative force and torque
        Rigidbody.AddRelativeForce(new Vector3(0.0f, 0.0f, Speed), ForceMode.Force);
        Rigidbody.AddRelativeTorque(new Vector3(0, Yaw * 3, 0.0f), ForceMode.Force);

        if (rotation.x > -0.3 && rotation.x < 0.3)
        {
            Rigidbody.AddRelativeTorque(new Vector3(Pitch * 4, 0, 0.0f), ForceMode.Force);
        }

        // attempt to flatten out ship orientation
        if (rotation.x < 0.01 && rotation.x > -0.01 && rotation.z < 0.01 && rotation.z > -0.01)
        {
            // already in the right rotation
        }
        else
        {
            float speed = 1.0f;
            Rigidbody.transform.rotation = Quaternion.Slerp(rotation, new Quaternion(0.0f, rotation.y, 0.0f, rotation.w), Time.deltaTime * speed);
        }

    }

    public void ApplyHelm(HelmPayload payload)
    {
        this.Speed = payload.speed;
        this.Yaw = payload.yaw;
        this.Pitch = payload.pitch;
    }

}

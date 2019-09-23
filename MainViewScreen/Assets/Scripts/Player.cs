using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;

public class Player : MonoBehaviour
{

    private Network Network { get; set; }
    private GameObject PlayerObject { get; set; }
    private Rigidbody Rigidbody { get; set; }

    private float Elapsed { get; set; }
    private TelemetryPayload LastTelemetryPayload { get; set; }

    public float Throttle { get; set; }
    public float Yaw { get; set; }
    public float Pitch { get; set; }

    void Start()
    {

        // get references
        Network = GameObject.Find("Game").GetComponent<Network>();
        PlayerObject = GameObject.Find("player");
        Rigidbody = PlayerObject.GetComponentInChildren<Rigidbody>();

    }

    void Update()
    {

        // send telemetry
        Elapsed += Time.deltaTime;
        if (Elapsed > 0.2)
        {
            Elapsed = 0.0f;

            // send telemetry data
            var pos = Rigidbody.transform.position;
            var rot = Rigidbody.transform.rotation.eulerAngles;
            TelemetryPayload payload = new TelemetryPayload()
            {
                posx = Mathf.CeilToInt(pos.x / 1000),
                posy = Mathf.CeilToInt(pos.y / 1000),
                posz = Mathf.CeilToInt(pos.z / 1000),
                rotx = Mathf.CeilToInt(rot.y), // x and y are inverted
            };
            payload.roty = (rot.x < 100) ? Mathf.CeilToInt(rot.x * -1) : Mathf.CeilToInt(360 - rot.x);
            if (LastTelemetryPayload == null || LastTelemetryPayload.IsDifferent(payload))
            {
                var msg = new Message<TelemetryPayload>()
                {
                    c = "telemetry",
                    p = payload,
                    e = 0
                };
                Network.Send(msg);
                LastTelemetryPayload = payload;
            }

        }

    }

    void FixedUpdate()
    {
        Quaternion rotation = Rigidbody.transform.localRotation;

        // apply relative force and torque
        Rigidbody.AddRelativeForce(new Vector3(0.0f, 0.0f, Throttle), ForceMode.Force);
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
        this.Throttle = payload.throttle;
        this.Yaw = payload.yaw;
        this.Pitch = payload.pitch;
    }

}

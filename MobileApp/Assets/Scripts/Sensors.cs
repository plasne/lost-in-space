using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;
using static Planet;
using static Ship;

public class Sensors : MonoBehaviour
{

    private const float ZoomSpeed = 300.0f;
    private const float MinZoom = 1000.0f;
    private const float MaxZoom = 30000.0f;

    private bool IsActivating = false;

    private Network Network { get; set; }
    private Camera Camera { get; set; }
    private GameObject Player { get; set; }
    private GameObject Features { get; set; }

    [Serializable]
    public class Feature
    {
        public string id;
        public string type;
        public bool add;
    }

    // NOTE: this is a stupid workaround because the JsonUtility doesn't work with generic in nested cases

    [Serializable]
    public class ZoneOfFeatures
    {
        public List<Feature> features;
    }

    [Serializable]
    public class ZoneOfPlanets
    {
        public List<PlanetPayload> features;
    }

    [Serializable]
    public class ZoneOfShips
    {
        public List<ShipPayload> features;
    }

    void Awake()
    {
        // NOTE: Awake used instead of Start because Awake will run even if the script
        //  doesn't because the object is disabled. This was necessary to support
        //  telemetry coming to the client.
        Network = GameObject.Find("Interface").GetComponent<Network>();
        Camera = gameObject.GetComponentInChildren<Camera>();
        Player = transform.GetChild(0).gameObject;
        Features = transform.GetChild(1).gameObject;
    }

    void Update()
    {

        // process zoom
        Zoom();

        // process activation
        if (IsActivating)
        {
            // ask for zone info
            IsActivating = false;
            var msg = new Message()
            {
                c = "zone?",
                e = 0
            };
            Network.Send(msg);
        }

    }

    public void Activate()
    {
        // this is fired when the interface is changed to this component
        IsActivating = true;
    }

    private void Zoom()
    {
        if (Input.touchCount == 2)
        {

            // get current positions
            Touch touchZero = Input.GetTouch(0);
            Touch touchOne = Input.GetTouch(1);

            // get previous positions
            Vector2 touchZeroPrevPos = touchZero.position - touchZero.deltaPosition;
            Vector2 touchOnePrevPos = touchOne.position - touchOne.deltaPosition;

            // calculate the magnitude
            float prevTouchDeltaMag = (touchZeroPrevPos - touchOnePrevPos).magnitude;
            float touchDeltaMag = (touchZero.position - touchOne.position).magnitude;
            float deltaMagnitudeDiff = prevTouchDeltaMag - touchDeltaMag;

            // change the camera size based on magnitude
            Camera.orthographicSize += deltaMagnitudeDiff * ZoomSpeed * Time.deltaTime;

            // make sure camera can only zoom in or out so far
            Camera.orthographicSize = Mathf.Clamp(Camera.orthographicSize, MinZoom, MaxZoom);

        }
    }

    public void ReceiveTelemetry(TelemetryPayload payload)
    {

        // process player
        if (payload.id == "00000000-0000-0000-0000-000000000000")
        {
            Player.transform.position = new Vector3(payload.posx, payload.posy, payload.posz);
            Player.transform.eulerAngles = new Vector3(payload.rotx, payload.roty, payload.rotz);
            return;
        }

        // process everything else
        var obj = GameObject.Find(payload.id);
        if (obj != null)
        {
            obj.transform.position = new Vector3(payload.posx, payload.posy, payload.posz);
            obj.transform.eulerAngles = new Vector3(payload.rotx, payload.roty, payload.rotz);
        }

    }

    public void ReceiveZone(string json)
    {
        var actual = JsonUtility.FromJson<Message<ZoneOfFeatures>>(json);

        // see if there is anything that needs to be destroyed
        for (int i = 0; i < Features.transform.childCount; i++)
        {
            var obj = Features.transform.GetChild(i);
            var found = actual.p.features.Find(f => f.id == obj.name);
            if (found == null) GameObject.Destroy(obj);
        }

        // add if it does not exist
        for (int i = 0; i < actual.p.features.Count; i++)
        {
            var feature = actual.p.features[i];
            var obj = GameObject.Find(feature.id);
            if (obj == null)
            {
                switch (feature.type)
                {
                    case "planet":
                        {

                            var pactual = JsonUtility.FromJson<Message<ZoneOfPlanets>>(json);
                            var planet = Planet.Instantiate(pactual.p.features[i]);
                            planet.transform.SetParent(Features.transform);
                            break;
                        }
                    case "vessel":
                        {
                            var sactual = JsonUtility.FromJson<Message<ZoneOfShips>>(json);
                            var ship = Ship.Instantiate(sactual.p.features[i]);
                            ship.transform.SetParent(Features.transform);
                            break;
                        }
                }
            }
        }

    }

}

using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;
using static Planet;

public class Sensors : MonoBehaviour
{

    private const float ZoomSpeed = 300.0f;
    private const float MinZoom = 1000.0f;
    private const float MaxZoom = 30000.0f;

    private Helm Helm { get; set; }
    private Camera Camera { get; set; }
    private GameObject Player { get; set; }
    private GameObject Features { get; set; }

    [Serializable]
    public class Feature
    {
        public string type;
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

    void Start()
    {
        Helm = Resources.FindObjectsOfTypeAll<Helm>().First();
        Camera = gameObject.GetComponentInChildren<Camera>();
        Player = transform.GetChild(0).gameObject;
        Features = transform.GetChild(1).gameObject;
    }

    void Update()
    {
        Zoom();
    }

    void Zoom()
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
        Player.transform.position = new Vector3(payload.posx, payload.posy, payload.posz);
        Player.transform.eulerAngles = new Vector3(payload.rotx, payload.roty, payload.rotz);
    }

    public void ReceiveZone(string json)
    {
        var actual = JsonUtility.FromJson<Message<ZoneOfFeatures>>(json);
        for (int i = 0; i < actual.p.features.Count; i++)
        {
            var feature = actual.p.features[i];
            switch (feature.type)
            {
                case "planet":
                    try
                    {
                        var pactual = JsonUtility.FromJson<Message<ZoneOfPlanets>>(json);
                        var planet = Planet.Instantiate(pactual.p.features[i]);
                        planet.transform.SetParent(Features.transform);
                    }
                    catch (Exception ex)
                    {
                        Debug.Log(ex.Message);
                        Debug.Log(ex.StackTrace);
                    }
                    break;
            }
        }
    }

}

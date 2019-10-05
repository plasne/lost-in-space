using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using UnityEngine;
using static Network;
using static Planet;
using static Vessel;

public class Game : MonoBehaviour
{

    private Network Network { get; set; }
    private Player Player { get; set; }
    private GameObject Features { get; set; }

    private double Elapsed { get; set; }

    public bool IsRequestingZone { get; set; }

    [Serializable]
    public class Feature
    {
        public string id;
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

    [Serializable]
    public class ZoneOfVessels
    {
        public List<VesselPayload> features;
    }

    void Start()
    {

        // get references
        Network = GameObject.Find("Game").GetComponent<Network>();
        Player = GameObject.Find("Player").GetComponent<Player>();
        Features = GameObject.Find("Features");

        // ask for zone info
        IsRequestingZone = true;

    }

    void Update()
    {

        // every second, consider if there is still something that needs to be done
        Elapsed += Time.deltaTime;
        if (Elapsed > 1.0f)
        {
            Elapsed = 0.0f;

            // continue requesting zone if you don't get it
            if (IsRequestingZone)
            {
                var msg = new Message()
                {
                    c = "zone?",
                    e = 0
                };
                Network.Send(msg);
            }

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
                        var pactual = JsonUtility.FromJson<Message<ZoneOfPlanets>>(json);
                        var planet = Planet.Instantiate(pactual.p.features[i]);
                        planet.transform.SetParent(Features.transform);
                        break;
                    case "vessel":
                        var vactual = JsonUtility.FromJson<Message<ZoneOfVessels>>(json);
                        var vessel = Vessel.Instantiate(vactual.p.features[i]);
                        vessel.transform.SetParent(Features.transform);
                        break;
                }
            }
        }

        IsRequestingZone = false;
    }


}

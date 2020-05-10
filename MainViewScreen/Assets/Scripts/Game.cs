using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;
using static Planet;
using static Ship;

public class Game : MonoBehaviour
{

    private Network Network { get; set; }
    private Player Player { get; set; }
    private GameObject Features { get; set; }

    private double ElapsedFast { get; set; }
    private double ElapsedSlow { get; set; }

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
    public class ZoneOfShips
    {
        public List<ShipPayload> features;
    }

    void Start()
    {

        // get references
        Network = GameObject.Find("Game").GetComponent<Network>();
        Player = Resources.FindObjectsOfTypeAll<Player>().First();
        Features = GameObject.Find("Features");

        // ask for zone info
        IsRequestingZone = true;

    }

    Facing ClosestFacing(GameObject source, GameObject target)
    {
        Facing closestFacing = null;
        float closestDistance = float.MaxValue;
        var facings = source.GetComponentsInChildren<Facing>();
        if (facings.Length < 1) Debug.LogError($"no facings were found in object {source.name}");
        foreach (var facing in facings)
        {
            var distance = Vector3.Distance(facing.transform.position, target.transform.position);
            if (distance < closestDistance)
            {
                closestFacing = facing;
                closestDistance = distance;
            }
        }
        return closestFacing;
    }

    void Update()
    {

        // advance the timers
        ElapsedFast += Time.deltaTime;
        ElapsedSlow += Time.deltaTime;

        // every 1 sec
        if (ElapsedSlow > 1.0f)
        {
            ElapsedSlow = 0.0f;

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

        // every 0.2 sec
        if (ElapsedFast > 0.2f)
        {
            ElapsedFast = 0.0f;

            // send all gameobj positions
            for (int i = 0; i < Features.transform.childCount; i++)
            {
                var obj = Features.transform.GetChild(i);
                var go = obj.GetComponent<GameObj>();
                var body = obj.GetComponent<Rigidbody>();
                if (go != null && body != null)
                {

                    // determine facings
                    var s2v = ClosestFacing(Player.gameObject, obj.gameObject);
                    var v2s = ClosestFacing(obj.gameObject, Player.gameObject);

                    // send telemetry data
                    var pos = body.transform.position;
                    var rot = body.transform.rotation.eulerAngles;
                    TelemetryPayload payload = new TelemetryPayload()
                    {
                        id = go.Id.ToString(),
                        posx = Mathf.CeilToInt(pos.x),
                        posy = Mathf.CeilToInt(pos.y),
                        posz = Mathf.CeilToInt(pos.z),
                        rotx = Mathf.CeilToInt(rot.x),
                        roty = Mathf.CeilToInt(rot.y),
                        rotz = Mathf.CeilToInt(rot.z),
                        s2v = s2v.Direction,
                        v2s = v2s.Direction
                    };
                    var msg = new Message<TelemetryPayload>()
                    {
                        c = "telemetry",
                        p = payload,
                        e = 0
                    };
                    Network.Send(msg);

                }
            }

        }

    }

    public void ReceiveZone(string json)
    {
        var actual = JsonUtility.FromJson<Message<ZoneOfFeatures>>(json);

        // see if there is anything that needs to be destroyed
        for (int i = 1; i < Features.transform.childCount; i++) // i=1 skips Player
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

        IsRequestingZone = false;
    }


}

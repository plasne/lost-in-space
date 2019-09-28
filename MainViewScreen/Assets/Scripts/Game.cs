using System;
using System.Collections;
using System.Net.Sockets;
using UnityEngine;
using static Network;

public class Game : MonoBehaviour
{

    private Network Network { get; set; }
    private Player Player { get; set; }

    private double Elapsed { get; set; }

    public bool IsRequestingZone { get; set; }

    IEnumerator WaitForZone()
    {
        IsRequestingZone = true;
        yield return new WaitUntil(() => IsRequestingZone == false);
    }

    void Start()
    {

        // get references
        Network = GameObject.Find("Game").GetComponent<Network>();
        Player = GameObject.Find("Player").GetComponent<Player>();

        // start requesting the zone
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


}

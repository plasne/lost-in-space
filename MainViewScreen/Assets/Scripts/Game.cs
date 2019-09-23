using System;
using System.Net.Sockets;
using UnityEngine;

public class Game : MonoBehaviour
{

    private Player Player { get; set; }

    void Start()
    {

        // get references
        Player = GameObject.Find("player").GetComponent<Player>();

    }

    void Update()
    {

    }


}

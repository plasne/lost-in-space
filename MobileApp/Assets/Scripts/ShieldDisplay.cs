using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShieldDisplay : MonoBehaviour
{

    void Start()
    {

    }

    void Update()
    {
        SetShields(2, 2, 2, 2);
    }

    public void SetShields(int fore, int aft, int port, int star)
    {

        // light fore
        if (fore > 0) transform.GetChild(15).GetComponent<Lamp>().SetLampColor("green");
        if (fore > 1) transform.GetChild(0).GetComponent<Lamp>().SetLampColor("green");
        if (fore > 2) transform.GetChild(14).GetComponent<Lamp>().SetLampColor("green");
        if (fore > 3) transform.GetChild(1).GetComponent<Lamp>().SetLampColor("green");

        // light aft
        if (aft > 0) transform.GetChild(7).GetComponent<Lamp>().SetLampColor("green");
        if (aft > 1) transform.GetChild(8).GetComponent<Lamp>().SetLampColor("green");
        if (aft > 2) transform.GetChild(6).GetComponent<Lamp>().SetLampColor("green");
        if (aft > 3) transform.GetChild(9).GetComponent<Lamp>().SetLampColor("green");

        // light port
        if (port > 0) transform.GetChild(11).GetComponent<Lamp>().SetLampColor("green");
        if (port > 1) transform.GetChild(12).GetComponent<Lamp>().SetLampColor("green");
        if (port > 2) transform.GetChild(10).GetComponent<Lamp>().SetLampColor("green");
        if (port > 3) transform.GetChild(13).GetComponent<Lamp>().SetLampColor("green");

        // light star
        if (star > 0) transform.GetChild(3).GetComponent<Lamp>().SetLampColor("green");
        if (star > 1) transform.GetChild(4).GetComponent<Lamp>().SetLampColor("green");
        if (star > 2) transform.GetChild(2).GetComponent<Lamp>().SetLampColor("green");
        if (star > 3) transform.GetChild(5).GetComponent<Lamp>().SetLampColor("green");


    }

    public void SetShields(int fore, int maxFore, int aft, int maxAft, int port, int maxPort, int star, int maxStar)
    {
        fore = Mathf.RoundToInt((float)fore / (float)maxFore * 4.0f);
        aft = Mathf.RoundToInt((float)aft / (float)maxAft * 4.0f);
        port = Mathf.RoundToInt((float)port / (float)maxPort * 4.0f);
        star = Mathf.RoundToInt((float)star / (float)maxStar * 4.0f);
        SetShields(fore, aft, port, star);
    }

}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerWheel : MonoBehaviour
{

    void Start()
    {
    }

    void Update()
    {
    }

    public void SetPowerLevel(int actual)
    {

        // light as appropriate
        for (int i = 0; i < 16; i++)
        {
            var lamp = transform.GetChild(i).GetComponent<Lamp>();
            if (actual > 0)
            {
                lamp.SetLampColor("green");
                actual--;
            }
            else
            {
                lamp.SetLampColor("unlit");
            }
        }

    }

    public void SetPowerLevel(int actual, int max)
    {
        actual = Mathf.RoundToInt((float)actual / (float)max * 16.0f);
        SetPowerLevel(actual);
    }

}

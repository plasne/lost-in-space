using System;
using UnityEngine;
using UnityEngine.UI;

public class PowerWheel : MonoBehaviour
{

    [SerializeField] private Text Value;

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
        actual = Mathf.Clamp(actual, 0, max);
        Value.text = actual.ToString().PadLeft(4, '0');
        var relative = Mathf.RoundToInt((float)actual / (float)max * 16.0f);
        SetPowerLevel(relative);
    }

}

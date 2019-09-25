using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnergyBar : MonoBehaviour
{

    private Vector3 ScreenPos { get; set; }
    private Rect Dimensions { get; set; }

    private int HoverPowerLevel { get; set; } = -1;
    public int DesiredPowerLevel { get; set; } = -1;

    void Start()
    {
        Init();
    }

    void Update()
    {

        // look for a touch
        if (Input.touchCount > 0)
        {

            // dimensions of power bar
            var left = ScreenPos.x + Dimensions.x;
            var right = ScreenPos.x - Dimensions.x;
            var top = ScreenPos.y - Dimensions.y;
            var bottom = ScreenPos.y + Dimensions.y;

            // record last position
            var pos = Input.GetTouch(0).position;
            if (pos.x > left && pos.x < right && pos.y > bottom && pos.y < top)
            {
                float y = (pos.y - ScreenPos.y - Dimensions.y);
                HoverPowerLevel = Mathf.CeilToInt(y / 100) - 1;
                if (HoverPowerLevel < 0) HoverPowerLevel = 0;
                if (HoverPowerLevel > 8) HoverPowerLevel = 8;
            }
            else
            {
                HoverPowerLevel = -1;
            }

        }
        else if (HoverPowerLevel > -1)
        {
            DesiredPowerLevel = HoverPowerLevel;
            HoverPowerLevel = -1;
        }

    }

    public void Init()
    {
        var camera = Resources.FindObjectsOfTypeAll<Camera>().First(c => c.name == "HelmCamera");
        ScreenPos = camera.WorldToScreenPoint(transform.position);
        RectTransform rt = (RectTransform)transform;
        Dimensions = rt.rect;
    }

    public void SetPowerLevel(int actual, int pending)
    {
        List<string> list = new List<string>();

        // if pending is down, show red lights
        if (pending < 0)
        {
            actual = actual + pending;
            for (int i = 0; i < actual; i++)
            {
                list.Add("green");
            }
            for (int i = pending; i < 0; i++)
            {
                list.Add("red");
            }
        }

        // if pending is up, show yellow lists
        if (pending > 0)
        {
            for (int i = 0; i < actual; i++)
            {
                list.Add("green");
            }
            for (int i = 0; i < pending; i++)
            {
                list.Add("yellow");
            }
        }

        // if there is no pending, go green
        if (pending == 0)
        {
            for (int i = 0; i < actual; i++)
            {
                list.Add("green");
            }
        }

        // add unlit
        while (list.Count < 8)
        {
            list.Add("unlit");
        }

        // light as appropriate
        for (int i = 8; i > 0; i--)
        {
            var lamp = transform.GetChild(i).GetComponent<Lamp>();
            var color = list[8 - i];
            lamp.SetLampColor(color);
        }

    }

}

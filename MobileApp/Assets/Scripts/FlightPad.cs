using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlightPad : MonoBehaviour
{

    private Vector3 ScreenPos { get; set; }
    private Rect Dimensions { get; set; }

    public int Yaw { get; set; }
    public int Pitch { get; set; }

    void Start()
    {
        Init();
    }

    void Update()
    {

        // look for a touch
        if (Input.touchCount > 0)
        {

            // dimensions of flight pad
            var left = ScreenPos.x + Dimensions.x; // 1716 + -300 = 1416
            var right = ScreenPos.x - Dimensions.x; // 1716 - -300 = 2016
            var top = ScreenPos.y - Dimensions.y; // 300 - -250 = 550
            var bottom = ScreenPos.y + Dimensions.y; // 300 + -250 = 50

            // calculate desired flight pad changes
            for (int i = 0; i < Input.touchCount; i++)
            {
                // check touch 0 and touch 1
                var pos = Input.GetTouch(i).position;
                if (pos.x > left && pos.x < right && pos.y > bottom && pos.y < top)
                {

                    // calc yaw; allow for 120 (of the 600) middle pixels to be neutral
                    float yaw = (pos.x - ScreenPos.x);
                    if (yaw > 60)
                    {
                        Yaw = Mathf.CeilToInt((yaw - 60) / 240 * 100);
                    }
                    else if (yaw < -60)
                    {
                        Yaw = Mathf.FloorToInt((yaw + 60) / 240 * 100);
                    }
                    else
                    {
                        Yaw = 0;
                    }

                    // calc pitch; allow for 100 (of the 500) middle pixels to be neutral
                    float pitch = (pos.y - ScreenPos.y);
                    if (pitch > 50)
                    {
                        Pitch = Mathf.CeilToInt((pitch - 50) / 200 * 100);
                    }
                    else if (pitch < -50)
                    {
                        Pitch = Mathf.FloorToInt((pitch + 50) / 200 * 100);
                    }
                    else
                    {
                        Pitch = 0;
                    }

                    break;
                }
            }

        }
        else
        {
            Yaw = 0;
            Pitch = 0;
        }

    }

    public void Init()
    {
        ScreenPos = Camera.main.WorldToScreenPoint(transform.position);
        RectTransform rt = (RectTransform)transform;
        Dimensions = rt.rect;
    }

}

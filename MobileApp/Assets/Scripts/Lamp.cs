using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Lamp : MonoBehaviour
{

    [SerializeField] private Texture RedLamp;
    [SerializeField] private Texture GreenLamp;
    [SerializeField] private Texture YellowLamp;
    [SerializeField] private Texture UnlitLamp;
    private RawImage Icon { get; set; }

    void Start()
    {
        Icon = GetComponent<RawImage>();
    }

    void Update()
    {

    }

    public void SetLampColor(string color)
    {
        switch (color)
        {
            case "red":
                Icon.texture = RedLamp;
                break;
            case "green":
                Icon.texture = GreenLamp;
                break;
            case "yellow":
                Icon.texture = YellowLamp;
                break;
            case "unlit":
                Icon.texture = UnlitLamp;
                break;
        }
    }

}

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FourDigit : MonoBehaviour
{

    private Text Overlay { get; set; }

    void Start()
    {
        var text = GetComponentsInChildren<Text>();
        Overlay = text[1];
    }

    void Update()
    {

    }

    public void SetToNumber(int number)
    {
        if (number < -999 || number > 9999)
        {
            Overlay.text = "";
        }
        else if (number < 0)
        {
            Overlay.text = "-" + Math.Abs(number).ToString().PadLeft(3, '0');
        }
        else
        {
            Overlay.text = number.ToString().PadLeft(4, '0');
        }
    }

}

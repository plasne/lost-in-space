using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LitButton : MonoBehaviour
{

    [SerializeField] private Sprite Lit;
    [SerializeField] private Sprite Unlit;
    private Image Icon { get; set; }

    void Start()
    {
        Icon = GetComponent<Image>();
    }

    void Update()
    {

    }

    public void SetLampColor(string color)
    {
        switch (color)
        {
            case "lit":
                Icon.sprite = Lit;
                break;
            case "unlit":
                Icon.sprite = Unlit;
                break;
        }
    }

    public void SetLampColor(bool isAvailable)
    {
        if (isAvailable)
        {
            SetLampColor("lit");
        }
        else
        {
            SetLampColor("unlit");
        }
    }

    public bool IsLit
    {
        get
        {
            return (Icon.sprite == Lit);
        }
    }

}

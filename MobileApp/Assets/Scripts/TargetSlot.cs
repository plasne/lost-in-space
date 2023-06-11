using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class TargetSlot : MonoBehaviour
{

    [SerializeField]
    private GameObject FeatureBin;

    private Toggle Toggle { get; set; }
    private GameObject Background { get; set; }
    private GameObject NoTargetBackground { get; set; }
    private GameObject DisabledBackground { get; set; }
    private GameObject Values { get; set; }

    void Start()
    {

        // get references
        Toggle = GetComponent<Toggle>();
        for (int i = 0; i < transform.childCount; i++)
        {
            var obj = transform.GetChild(i).gameObject;
            switch (obj.name)
            {
                case "Background":
                    Background = obj;
                    break;
                case "NoTargetBackground":
                    NoTargetBackground = obj;
                    break;
                case "DisabledBackground":
                    DisabledBackground = obj;
                    break;
                case "Values":
                    Values = obj;
                    break;
            }
        }

    }

    public void SetToNoTarget()
    {
        NoTargetBackground.SetActive(true);
        Background.SetActive(false);
        DisabledBackground.SetActive(false);
        Values.SetActive(false);
        Toggle.isOn = false;
        Toggle.interactable = false;
    }

    public void SetToDisabled()
    {
        DisabledBackground.SetActive(true);
        NoTargetBackground.SetActive(false);
        Background.SetActive(false);
        Values.SetActive(false);
        Toggle.isOn = false;
        Toggle.interactable = false;
    }

    public void SetToFeature(string idPlus)
    {
        var idSplit = idPlus.Split(',');
        var id = idSplit[0];
        for (int i = 0; i < FeatureBin.transform.childCount; i++)
        {
            if (FeatureBin.transform.GetChild(i).gameObject.name == id)
            {
                Background.SetActive(true);
                DisabledBackground.SetActive(false);
                NoTargetBackground.SetActive(false);
                Values.SetActive(true);
                Toggle.isOn = true;
                Toggle.interactable = true;
                SetStats(idSplit);
                return;
            }
        }
        SetToNoTarget();
    }

    private string Format(string val)
    {
        if (int.TryParse(val, out int num))
        {
            if (num > 999) num = 999;
            if (num < 0) num = 0;
            return num.ToString().PadLeft(3, '0');
        }
        else
        {
            return "-?-";
        }
    }

    private void SetStats(string[] stats)
    {
        Values.transform.GetChild(0).GetComponent<Text>().text = stats[1]; // title
        Values.transform.GetChild(1).GetComponent<Text>().text = stats[2]; // classification
        var icon = Resources.Load($"Images/{stats[3]}", typeof(Texture2D)) as Texture2D;
        Values.transform.GetChild(2).GetComponent<RawImage>().texture = icon; // icon
        Values.transform.GetChild(3).GetComponent<Lamp>().SetLampColor(stats[4] == "fore" ? "green" : "unlit"); // v2s
        Values.transform.GetChild(4).GetComponent<Lamp>().SetLampColor(stats[4] == "aft" ? "green" : "unlit");
        Values.transform.GetChild(5).GetComponent<Lamp>().SetLampColor(stats[4] == "port" ? "green" : "unlit");
        Values.transform.GetChild(6).GetComponent<Lamp>().SetLampColor(stats[4] == "star" ? "green" : "unlit");
        Values.transform.GetChild(8).GetComponent<Lamp>().SetLampColor(stats[5] == "fore" ? "green" : "unlit"); // s2v
        Values.transform.GetChild(9).GetComponent<Lamp>().SetLampColor(stats[5] == "aft" ? "green" : "unlit");
        Values.transform.GetChild(10).GetComponent<Lamp>().SetLampColor(stats[5] == "port" ? "green" : "unlit");
        Values.transform.GetChild(11).GetComponent<Lamp>().SetLampColor(stats[5] == "star" ? "green" : "unlit");
        Values.transform.GetChild(12).GetComponent<Text>().text = stats[6]; // range
        Values.transform.GetChild(13).GetComponent<Text>().text = Format(stats[7]); // hull
        Values.transform.GetChild(14).GetComponent<Text>().text = Format(stats[8]); // shields-fore
        Values.transform.GetChild(15).GetComponent<Text>().text = Format(stats[9]); // shields-aft
        Values.transform.GetChild(16).GetComponent<Text>().text = Format(stats[10]); // shields-port
        Values.transform.GetChild(17).GetComponent<Text>().text = Format(stats[11]); // shields-starboard
        Values.transform.GetChild(18).GetComponent<Text>().text = Format(stats[12]); // speed
        Values.transform.GetChild(19).GetComponent<Text>().text = Format(stats[12]); // crew
        Values.transform.GetChild(20).GetComponent<Text>().text = Format(stats[13]); // hit
        Values.transform.GetChild(21).GetComponent<Text>().text = Format(stats[14]); // crit
        Values.transform.GetChild(22).GetComponent<Text>().text = Format(stats[15]); // assault
        Values.transform.GetChild(23).GetComponent<Text>().text = Format(stats[16]); // evade
        Values.transform.GetChild(24).GetComponent<Text>().text = Format(stats[17]); // armor
        Values.transform.GetChild(25).GetComponent<Text>().text = Format(stats[18]); // resist
        Values.transform.GetChild(26).GetComponent<Text>().text = Format(stats[19]); // emit
        Values.transform.GetChild(27).GetComponent<Text>().text = Format(stats[20]); // detect
        Values.transform.GetChild(28).GetComponent<Text>().text = Format(stats[21]); // hack
    }

    public void Apply(string id)
    {
        switch (id)
        {
            case "no-target":
                SetToNoTarget();
                break;
            case "disabled":
                SetToDisabled();
                break;
            default:
                SetToFeature(id);
                break;
        }
    }

}

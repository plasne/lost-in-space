using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static Network;

public class Interface : MonoBehaviour
{

    private Network Network { get; set; }
    private Camera LobbyCamera { get; set; }
    private GameObject Lobby { get; set; }
    private Camera HelmCamera { get; set; }
    private GameObject Helm { get; set; }
    private Camera TacticalCamera { get; set; }
    private GameObject Tactical { get; set; }
    private Camera SensorsCamera { get; set; }
    private GameObject Sensors { get; set; }
    private Camera ScannersCamera { get; set; }
    private GameObject Scanners { get; set; }

    void Start()
    {

        // references
        Network = GameObject.Find("Interface").GetComponent<Network>();

        // make all camera objects active and all cameras but Lobby covered
        foreach (var camera in Resources.FindObjectsOfTypeAll<Camera>())
        {
            switch (camera.name)
            {
                case "LobbyCamera":
                    LobbyCamera = camera;
                    LobbyCamera.gameObject.SetActive(true);
                    LobbyCamera.enabled = true;
                    break;
                case "HelmCamera":
                    HelmCamera = camera;
                    HelmCamera.gameObject.SetActive(true);
                    HelmCamera.enabled = false;
                    break;
                case "TacticalCamera":
                    TacticalCamera = camera;
                    TacticalCamera.gameObject.SetActive(true);
                    TacticalCamera.enabled = false;
                    break;
                case "SensorsCamera":
                    SensorsCamera = camera;
                    SensorsCamera.gameObject.SetActive(true);
                    SensorsCamera.enabled = false;
                    Sensors = camera.GetComponentInParent<Sensors>().gameObject;
                    Sensors.SetActive(false);
                    break;
                case "ScannersCamera":
                    ScannersCamera = camera;
                    ScannersCamera.gameObject.SetActive(true);
                    ScannersCamera.enabled = false;
                    break;
            }
        }

        // make all interfaces inactive except the lobby
        foreach (var canvas in Resources.FindObjectsOfTypeAll<Canvas>())
        {
            switch (canvas.name)
            {
                case "Lobby":
                    Lobby = canvas.gameObject;
                    Lobby.SetActive(true);
                    break;
                case "Helm":
                    Helm = canvas.gameObject;
                    Helm.SetActive(false);
                    break;
                case "Tactical":
                    Tactical = canvas.gameObject;
                    Tactical.SetActive(false);
                    break;
                case "Scanners":
                    Scanners = canvas.gameObject;
                    Scanners.SetActive(false);
                    break;
            }
        }

    }

    void Update()
    {

    }

    public void SwitchTo(string station)
    {

        // disable all camera
        LobbyCamera.enabled = false;
        HelmCamera.enabled = false;
        TacticalCamera.enabled = false;
        SensorsCamera.enabled = false;
        SensorsCamera.enabled = false;

        // inactivate all interfaces
        Lobby.SetActive(false);
        Helm.SetActive(false);
        Tactical.SetActive(false);
        Sensors.SetActive(false);
        Sensors.SetActive(false);

        // activate the appropriate station
        switch (station)
        {
            case "lobby":
                LobbyCamera.enabled = true;
                Lobby.SetActive(true);
                Lobby.GetComponent<Lobby>().Activate();
                break;
            case "helm":
                HelmCamera.enabled = true;
                Helm.SetActive(true);
                Helm.GetComponent<Helm>().Activate();
                break;
            case "tactical":
                TacticalCamera.enabled = true;
                Tactical.SetActive(true);
                Tactical.GetComponent<Tactical>().Activate();
                break;
            case "sensors":
                SensorsCamera.enabled = true;
                Sensors.SetActive(true);
                Sensors.GetComponent<Sensors>().Activate();
                break;
            case "scanners":
                ScannersCamera.enabled = true;
                Scanners.SetActive(true);
                //Scanners.GetComponent<Scanners>().Activate();
                break;
        }

    }

    public void StartGame()
    {
        var msg = new Message()
        {
            c = "start",
            e = 0
        };
        Network.Send(msg);
    }

    public void GoToLobby()
    {
        SwitchTo("lobby");
    }

    public void GoToHelm()
    {
        SwitchTo("helm");
    }

    public void GoToTactical()
    {
        SwitchTo("tactical");
    }

    public void GoToSensors()
    {
        SwitchTo("sensors");
    }

    public void GoToScanners()
    {
        SwitchTo("scanners");
    }

}

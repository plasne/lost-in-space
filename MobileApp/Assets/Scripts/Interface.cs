﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Interface : MonoBehaviour
{

    private Camera LobbyCamera { get; set; }
    private GameObject Lobby { get; set; }
    private Camera HelmCamera { get; set; }
    private GameObject Helm { get; set; }
    private Camera TacticalCamera { get; set; }
    private GameObject Tactical { get; set; }
    private Camera SensorsCamera { get; set; }
    private GameObject Sensors { get; set; }

    void Start()
    {

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
                    Sensors = camera.transform.parent.gameObject;
                    Sensors.SetActive(false);
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

        // inactivate all interfaces
        Lobby.SetActive(false);
        Helm.SetActive(false);
        Tactical.SetActive(false);
        Sensors.SetActive(false);

        // activate the appropriate station
        switch (station)
        {
            case "lobby":
                LobbyCamera.enabled = true;
                Lobby.SetActive(true);
                break;
            case "helm":
                HelmCamera.enabled = true;
                Helm.SetActive(true);
                break;
            case "tactical":
                TacticalCamera.enabled = true;
                Tactical.SetActive(true);
                break;
            case "sensors":
                SensorsCamera.enabled = true;
                Sensors.SetActive(true);
                break;
        }

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

}
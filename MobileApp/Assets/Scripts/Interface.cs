using System.Collections;
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
        switch (station)
        {
            case "lobby":
                LobbyCamera.enabled = true;
                HelmCamera.enabled = TacticalCamera.enabled = false;
                Lobby.SetActive(true);
                Helm.SetActive(false);
                Tactical.SetActive(false);
                break;
            case "helm":
                HelmCamera.enabled = true;
                LobbyCamera.enabled = TacticalCamera.enabled = false;
                Lobby.SetActive(false);
                Helm.SetActive(true);
                Tactical.SetActive(false);
                break;
            case "tactical":
                TacticalCamera.enabled = true;
                HelmCamera.enabled = LobbyCamera.enabled = false;
                Lobby.SetActive(false);
                Helm.SetActive(false);
                Tactical.SetActive(true);
                break;
        }
    }

    public void GoToLobby()
    {
        Debug.Log("here");
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

}

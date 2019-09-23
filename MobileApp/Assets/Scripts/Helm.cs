using System;
using System.Collections.Generic;
using System.Net.Sockets;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using static Network;

public class Helm : MonoBehaviour
{

    [Serializable]
    public class ToHelmStation
    {
        public int throttle; // 0-100%
        public int yaw; // -100% - +100%
        public int pitch; // -100% - +100%
        public int enginePower;
        public int jumpPower;
        public int thrusterPower;
    }

    [Serializable]
    public class FromHelmStation
    {
        public int enginePower;
        public int enginePendingPower;
        public int jumpPower;
        public int jumpPendingPower;
        public int thrusterPower;
        public int thrusterPendingPower;
        public int crew;
        public bool crewIsEvac;
        public bool jumpIsAvailable;
        public bool upgrade1IsAvailable;
        public bool upgrade2IsAvailable;
        public bool upgrade3IsAvailable;
        public int foreShields;
        public int maxForeShields;
        public int aftShields;
        public int maxAftShields;
        public int portShields;
        public int maxPortShields;
        public int starShields;
        public int maxStarShields;
        public int reserve;
        public int maxReserve;
    }

    private Network Network { get; set; }
    private FlightPad FlightPad { get; set; }
    private Slider Throttle { get; set; }
    private EnergyBar EnginePower { get; set; }
    private EnergyBar JumpPower { get; set; }
    private EnergyBar ThrusterPower { get; set; }
    private FourDigit Crew { get; set; }
    private LitButton Jump { get; set; }
    private LitButton Evac { get; set; }
    private ShieldDisplay Shields { get; set; }
    private PowerWheel ReservePower { get; set; }

    private double Elapsed { get; set; }

    private FourDigit PosX { get; set; }
    private FourDigit PosY { get; set; }
    private FourDigit PosZ { get; set; }
    private FourDigit RotX { get; set; }
    private FourDigit RotY { get; set; }

    void Start()
    {

        // get references
        Network = GameObject.Find("Interface").GetComponent<Network>();
        FlightPad = GameObject.Find("FlightPad").GetComponent<FlightPad>();
        Throttle = GameObject.Find("Throttle").GetComponent<Slider>();
        EnginePower = GameObject.Find("EnginePower").GetComponent<EnergyBar>();
        JumpPower = GameObject.Find("JumpPower").GetComponent<EnergyBar>();
        ThrusterPower = GameObject.Find("ThrusterPower").GetComponent<EnergyBar>();
        Crew = GameObject.Find("Crew").GetComponent<FourDigit>();
        Jump = GameObject.Find("Jump").GetComponent<LitButton>();
        Evac = GameObject.Find("Evac").GetComponent<LitButton>();
        Shields = GameObject.Find("Shields").GetComponent<ShieldDisplay>();
        ReservePower = GameObject.Find("ReservePower").GetComponent<PowerWheel>();
        PosX = GameObject.Find("POS-X").GetComponent<FourDigit>();
        PosY = GameObject.Find("POS-Y").GetComponent<FourDigit>();
        PosZ = GameObject.Find("POS-Z").GetComponent<FourDigit>();
        RotX = GameObject.Find("ROT-X").GetComponent<FourDigit>();
        RotY = GameObject.Find("ROT-Y").GetComponent<FourDigit>();

    }

    void Update()
    {

        // read interface changes every 200 ms
        Elapsed += Time.deltaTime;
        if (Elapsed > 0.2)
        {
            Elapsed = 0.0f;
            SendToHelmStation();
        }

    }

    public void ReceiveTelemetry(TelemetryPayload payload)
    {
        PosX.SetToNumber(payload.posx);
        PosY.SetToNumber(payload.posy);
        PosZ.SetToNumber(payload.posz);
        RotX.SetToNumber(payload.rotx);
        RotY.SetToNumber(payload.roty);
    }

    private void SendToHelmStation()
    {
        ToHelmStation payload = new ToHelmStation();

        // get yaw and pitch
        payload.yaw = FlightPad.Yaw;
        payload.pitch = FlightPad.Pitch;

        // calculate throttle
        payload.throttle = Mathf.CeilToInt(Throttle.value * 100.0f);

        // send desired power
        payload.enginePower = EnginePower.DesiredPowerLevel;
        EnginePower.DesiredPowerLevel = -1; // reset
        payload.jumpPower = JumpPower.DesiredPowerLevel;
        JumpPower.DesiredPowerLevel = -1; // reset
        payload.thrusterPower = ThrusterPower.DesiredPowerLevel;
        ThrusterPower.DesiredPowerLevel = -1; // reset

        // send info
        var msg = new Message<ToHelmStation>()
        {
            c = "helm",
            p = payload,
            e = 0
        };
        Network.Send(msg);

    }

    public void ReceiveFromHelmStation(FromHelmStation payload)
    {
        EnginePower.SetPowerLevel(payload.enginePower, payload.enginePendingPower);
        JumpPower.SetPowerLevel(payload.jumpPower, payload.jumpPendingPower);
        ThrusterPower.SetPowerLevel(payload.thrusterPower, payload.thrusterPendingPower);
        Crew.SetToNumber(payload.crew);
        Jump.SetLampColor(payload.jumpIsAvailable);
        Evac.SetLampColor(payload.crewIsEvac);
        // upgrade1
        // upgrade2
        // upgrade3
        Shields.SetShields(
            payload.foreShields, payload.maxForeShields,
            payload.aftShields, payload.maxAftShields,
            payload.portShields, payload.maxPortShields,
            payload.starShields, payload.maxStarShields
        );
        ReservePower.SetPowerLevel(payload.reserve, payload.maxReserve);
    }

}

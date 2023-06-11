using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using static Network;

public class Tactical : MonoBehaviour
{

    [SerializeField] private Network Network;
    [SerializeField] private EnergyBar BattleStationsPower;
    [SerializeField] private EnergyBar WeaponChargePower;
    [SerializeField] private EnergyBar ShieldsPower;
    [SerializeField] private FourDigit Crew;
    [SerializeField] private LitButton Evac;
    [SerializeField] private ShieldDisplay Shields;
    [SerializeField] private PowerWheel ReservePower;
    [SerializeField] private PowerWheel ChargePower;
    [SerializeField] private Button Action1;
    [SerializeField] private Button Action2;
    [SerializeField] private Button Action3;
    [SerializeField] private TargetSlot TargetSlot1;
    [SerializeField] private TargetSlot TargetSlot2;
    [SerializeField] private TargetSlot TargetSlot3;
    [SerializeField] private TargetSlot TargetSlot4;
    [SerializeField] private TargetSlot TargetSlot5;
    [SerializeField] private Card Card1;
    [SerializeField] private Card Card2;
    [SerializeField] private Card Card3;
    [SerializeField] private Card Card4;
    [SerializeField] private Card Card5;
    [SerializeField] private LitButton Hold;

    [Serializable]
    public class ToTacticalStation
    {
        public int battleStationsPower;
        public int weaponChargePower;
        public int shieldsPower;
    }

    [Serializable]
    public class FromTacticalStation
    {
        public int battleStationsPower;
        public int battleStationsPendingPower;
        public int weaponChargePower;
        public int weaponChargePendingPower;
        public int shieldsPower;
        public int shieldsPendingPower;
        public string targetSlot1;
        public string targetSlot2;
        public string targetSlot3;
        public string targetSlot4;
        public string targetSlot5;
        public int maxShields;
        public int foreShields;
        public int aftShields;
        public int portShields;
        public int starShields;
        public int reserve;
        public int maxReserve;
        public int card1;
        public int card2;
        public int card3;
        public int card4;
        public int card5;
    }

    private double Elapsed { get; set; }
    private bool IsActivating { get; set; } = false;

    void Update()
    {

        // process activation
        if (IsActivating)
        {
            // ask for zone info
            IsActivating = false;
            var msg = new Message()
            {
                c = "zone?",
                e = 0
            };
            Network.Send(msg);
        }

        // read interface changes every 1 second
        Elapsed += Time.deltaTime;
        if (Elapsed > 1.0)
        {
            Elapsed = 0.0f;
            SendToTacticalStation();
        }

    }

    private void SendToTacticalStation()
    {
        ToTacticalStation payload = new ToTacticalStation();

        // send desired power
        payload.battleStationsPower = BattleStationsPower.DesiredPowerLevel;
        BattleStationsPower.DesiredPowerLevel = -1; // reset
        payload.weaponChargePower = WeaponChargePower.DesiredPowerLevel;
        WeaponChargePower.DesiredPowerLevel = -1; // reset
        payload.shieldsPower = ShieldsPower.DesiredPowerLevel;
        ShieldsPower.DesiredPowerLevel = -1; // reset

        // send info
        var msg = new Message<ToTacticalStation>()
        {
            c = "tactical",
            p = payload,
            e = 0
        };
        Network.Send(msg);

    }

    public void ReceiveFromTacticalStation(FromTacticalStation payload)
    {
        BattleStationsPower.SetPowerLevel(payload.battleStationsPower, payload.battleStationsPendingPower);
        WeaponChargePower.SetPowerLevel(payload.weaponChargePower, payload.weaponChargePendingPower);
        ShieldsPower.SetPowerLevel(payload.shieldsPower, payload.shieldsPendingPower);
        TargetSlot1.Apply(payload.targetSlot1);
        TargetSlot2.Apply(payload.targetSlot2);
        TargetSlot3.Apply(payload.targetSlot3);
        TargetSlot4.Apply(payload.targetSlot4);
        TargetSlot5.Apply(payload.targetSlot5);
        Shields.SetShields(
            payload.maxShields,
            payload.foreShields,
            payload.aftShields,
            payload.portShields,
            payload.starShields
        );
        ReservePower.SetPowerLevel(payload.reserve, payload.maxReserve);
        Card1.SetCardId(payload.card1);
        Card2.SetCardId(payload.card2);
        Card3.SetCardId(payload.card3);
        Card4.SetCardId(payload.card4);
        Card5.SetCardId(payload.card5);
    }

    private void ClickButton(string id)
    {
        var msg = new Message<ButtonClick>()
        {
            c = "button",
            p = new ButtonClick() { id = id },
            e = 0
        };
        Network.Send(msg);
    }

    public void DoAction1()
    {
        ClickButton("tactical.action1");
    }

    public void DoAction2()
    {
        ClickButton("tactical.action2");
    }

    public void DoAction3()
    {
        ClickButton("tactical.action3");
    }

    public void ToggleHold()
    {
        if (Hold.IsLit)
        {
            Hold.SetLampColor("unlit");
            ClickButton("tactical.unhold");
        }
        else
        {
            Hold.SetLampColor("lit");
            ClickButton("tactical.hold");
        }
    }

    public void Activate()
    {
        // this is fired when the interface is changed to this component
        IsActivating = true;
    }

}

using System;
using UnityEngine;

public class Ship : GameObj
{

    [Serializable]
    public class ShipPayload
    {
        public string id;
        public string name;
        public string designation;
        public int x;
        public int y;
        public int z;
    }

    [SerializeField] private int Classification;
    [SerializeField] private float ShieldSize;
    [SerializeField] public float ShieldDistance;

    public override string ExplosionPrefab
    {
        get
        {
            return $"explosion0{Classification}";
        }
    }

    public void ShowShield(Vector3 shield_position, Vector3 damage_position)
    {
        GameObject template = (GameObject)Resources.Load("Models/shield-contact", typeof(GameObject));
        GameObject instance = (GameObject)Instantiate(template);
        instance.transform.position = shield_position;
        instance.transform.LookAt(damage_position);
        instance.transform.localScale = new Vector3(ShieldSize, ShieldSize, ShieldSize);
        instance.transform.SetParent(transform);
        Destroy(instance, 2.0f);
    }

    public void Define(ShipPayload payload)
    {
        var renderer = this.GetComponent<MeshRenderer>();
        transform.position = new Vector3(payload.x, payload.y, payload.z);
    }

    public static Ship Instantiate(ShipPayload payload)
    {
        var prefab = Resources.Load($"Models/{payload.designation}");
        GameObject obj = (GameObject)GameObject.Instantiate(prefab);
        obj.name = payload.id;
        var ship = obj.GetComponent<Ship>();
        ship.Define(payload);
        return ship;
    }


}
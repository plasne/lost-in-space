using System;
using UnityEngine;

public class Ship : MonoBehaviour
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
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Planet : MonoBehaviour
{

    [Serializable]
    public class PlanetPayload
    {
        public string id;
        public int size;
        public int material;
        public int x;
        public int y;
        public int z;
    }

    public List<Material> Materials = new List<Material>();

    void Start()
    {
    }

    void Update()
    {
    }

    void FixedUpdate()
    {
        transform.Rotate(0.0f, 0.04f, 0.0f);
    }

    public void Define(PlanetPayload payload)
    {
        transform.localScale = new Vector3(payload.size, payload.size, payload.size);
        var renderer = this.GetComponent<MeshRenderer>();
        renderer.material = Materials[payload.material];
        transform.position = new Vector3(payload.x, payload.y, payload.z);
    }

    public static Planet Instantiate(PlanetPayload payload)
    {
        var prefab = Resources.Load("Prefabs/Planet");
        GameObject obj = (GameObject)GameObject.Instantiate(prefab);
        obj.name = payload.id;
        var planet = obj.GetComponent<Planet>();
        planet.Define(payload);
        return planet;
    }

}

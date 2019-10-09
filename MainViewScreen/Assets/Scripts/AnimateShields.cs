using UnityEngine;
using System.Collections;

public class AnimateShields : MonoBehaviour
{

    private Material material;
    private float start = -10.0f;
    private float stop = 10.0f;
    private float current = -10.0f;
    private float speed = 200.00f;

    void Awake()
    {
        Renderer r = GetComponent<Renderer>();
        material = r.material;
    }

    void Update()
    {
        current += (Time.deltaTime * speed);
        material.mainTextureOffset = new Vector2(current, current);
        if (current >= stop || current <= start) speed *= -1;
    }
}

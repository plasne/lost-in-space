using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TimeLimit : MonoBehaviour
{

    public float after;

    void Awake()
    {
        Destroy(gameObject, after);
    }

}

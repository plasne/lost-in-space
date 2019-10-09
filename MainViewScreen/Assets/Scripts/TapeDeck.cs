using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class TapeDeck : MonoBehaviour
{

    private AudioSource audioSource;

    public bool playOnEnable = true;
    public float delay;
    public float startAt;
    public float fadeOutAt = -1.0f;

    private float t = 0.0f;
    private float volume = 1.0f;
    private float lifetime = 0.0f;

    public void Stop()
    {
        audioSource.Stop();
    }

    private void Play_Actual(float use_delay)
    {
        t = 0.0f;
        audioSource.time = startAt;
        audioSource.volume = volume;
        audioSource.PlayDelayed(use_delay);
    }

    public void Play()
    {
        volume = audioSource.volume;
        Play_Actual(0.0f);
    }

    void Update()
    {
        if (audioSource.isPlaying)
        {
            t += Time.deltaTime * Time.timeScale;
            if (fadeOutAt >= 0.0f && t >= fadeOutAt)
            {
                float duration = lifetime - fadeOutAt;
                float position = t - fadeOutAt;
                audioSource.volume = Mathf.Lerp(volume, 0.0f, position / duration);
            }
        }
    }

    void OnEnable()
    {
        if (playOnEnable) Play_Actual(delay);
    }

    void Awake()
    {
        audioSource = GetComponent<AudioSource>();
        volume = audioSource.volume;
        TimeLimit timeLimit = GetComponent<TimeLimit>();
        lifetime = (timeLimit) ? timeLimit.after : (audioSource.clip.length - delay);
    }

}

/*
[CustomEditor(typeof(TapeDeck))]
public class TapeDeckEditor : Editor
{
	public override void OnInspectorGUI()
	{
		DrawDefaultInspector();

		TapeDeck tapeDeck = (TapeDeck)target;

		if(GUILayout.Button("Play"))
		{
			tapeDeck.Play ();
		}

		if(GUILayout.Button("Stop"))
		{
			tapeDeck.Stop ();
		}

	}
}
*/

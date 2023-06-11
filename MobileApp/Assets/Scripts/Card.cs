using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using static Network;

public class Card : MonoBehaviour, IPointerClickHandler
{

    [SerializeField] private Network Network;

    private float Speed = 0.25f; // per stage
    private float TimeCount = 0.0f;
    private int Stage = 0;
    private int Id = 0;

    private Texture2D CardFront;
    private Texture2D CardBack;
    private Quaternion FaceUp = Quaternion.Euler(0.0f, 0.0f, 0.0f);
    private Quaternion OnSide = Quaternion.Euler(0.0f, 90.0f, 0.0f);
    private Quaternion FaceDown = Quaternion.Euler(0.0f, 180.0f, 0.0f);

    void Start()
    {
        CardBack = GetComponent<RawImage>().texture as Texture2D;
    }

    void Update()
    {

        // add time
        if (Stage > 0) TimeCount += Time.deltaTime;

        // transform
        switch (Stage)
        {
            case 1: // flipping from face-up to on-side
                transform.rotation = Quaternion.Slerp(FaceUp, OnSide, TimeCount / Speed);
                break;
            case 2: // flipping from on-side to face-down
                transform.rotation = Quaternion.Slerp(OnSide, FaceDown, TimeCount / Speed);
                break;
            case 3: // flipping from face-down to on-side
                transform.rotation = Quaternion.Slerp(FaceDown, OnSide, TimeCount / Speed);
                break;
            case 4: // flipping from on-side to face-up
                transform.rotation = Quaternion.Slerp(OnSide, FaceUp, TimeCount / Speed);
                break;
        }

        // advance
        if (Stage > 0 && TimeCount >= Speed)
        {
            Stage++;
            TimeCount = 0.0f;
            if (Stage > 4)
            {
                Stage = 0;
                transform.rotation = FaceUp;
            }
            if (Stage == 2) GetComponent<RawImage>().texture = CardBack;
            if (Stage == 4) GetComponent<RawImage>().texture = CardFront;
        }

    }

    public void SetTacMsg(string msg)
    {
        transform.GetChild(0).gameObject.SetActive(true);
        transform.GetChild(1).gameObject.SetActive(true);
        transform.GetChild(1).GetComponent<Text>().text = msg;
    }

    public void SetHullDmg(int dmg)
    {
        transform.GetChild(2).gameObject.SetActive(true);
        transform.GetChild(3).gameObject.SetActive(true);
        transform.GetChild(3).GetComponent<Text>().text = dmg.ToString();
    }

    public void SetShieldsDmg(int dmg)
    {
        transform.GetChild(4).gameObject.SetActive(true);
        transform.GetChild(5).gameObject.SetActive(true);
        transform.GetChild(5).GetComponent<Text>().text = dmg.ToString();
    }

    public void ClearBlips()
    {
        for (int i = 0; i < transform.childCount; i++)
        {
            transform.GetChild(i).gameObject.SetActive(false);
        }
    }

    private bool _isAvailable = true;

    public bool IsAvailable
    {
        get => _isAvailable;
        set
        {
            _isAvailable = value;
            GetComponent<RawImage>().color = value ? Color.white : Color.gray;
        }
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

    private float Clicked = 0;
    private float ClickTime = 0;
    private float ClickDelay = 0.5f;

    public virtual void OnPointerClick(PointerEventData eventData)
    {
        if (IsAvailable == false || Stage > 0) return;
        Clicked++;
        if (Clicked == 1) ClickTime = Time.time;
        if (Clicked > 1 && Time.time - ClickTime < ClickDelay)
        {
            // double-clicked
            Clicked = 0;
            ClickTime = 0;
            IsAvailable = false;
            SetTacMsg("FIRE");
            ClickButton($"tactical.{Id}");
        }
        else if (Clicked > 2 || Time.time - ClickTime > 1)
        {
            Clicked = 0;
        }
    }

    public void SetCardId(int id)
    {
        if (id != this.Id)
        {
            this.Id = id;
            IsAvailable = true;
            ClearBlips();
            if (Stage == 0)
            {
                Stage = 1;
                TimeCount = 0.0f;
                CardFront = Resources.Load($"Cards/{id}", typeof(Texture2D)) as Texture2D;
            }
        }
    }

}
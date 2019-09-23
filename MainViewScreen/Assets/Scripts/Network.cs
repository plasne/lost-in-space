using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

public class Network : MonoBehaviour
{

    public class Message
    {
        public int i; // messageId for receipt
        public string c; // command
        public int e; // is encoded?
    }

    [Serializable]
    public class Message<T> : Message
    {
        public T p; // payload
    }

    [Serializable]
    public class Client
    {
        public string id;
    }

    [Serializable]
    public class HelmPayload
    {
        public int throttle;
        public int yaw;
        public int pitch;
    }

    [Serializable]
    public class TelemetryPayload
    {
        public int posx;
        public int posy;
        public int posz;
        public int rotx;
        public int roty;
        public int rotz;

        public bool IsDifferent(TelemetryPayload payload)
        {
            if (posx != payload.posx) return true;
            if (posy != payload.posy) return true;
            if (posz != payload.posz) return true;
            if (rotx != payload.rotx) return true;
            if (roty != payload.roty) return true;
            if (rotz != payload.rotz) return true;
            return false;
        }
    }

    private Player Player { get; set; }
    private ConnectionLamp ConnectionLamp { get; set; }

    private double Elapsed { get; set; }

    private TcpClient TcpClient { get; set; }
    private Task TcpClientConnectTask { get; set; }
    private string Buffer { get; set; }
    private float LastSentAt { get; set; }
    private float LastReceivedAt { get; set; }

    public void Send(Message msg)
    {

        // serialize and encode as bytes
        string json = JsonUtility.ToJson(msg);
        Debug.Log($"send: {json}");
        Byte[] bytes = System.Text.Encoding.ASCII.GetBytes(json + "\n");

        // attempt to send
        try
        {
            TcpClient.GetStream().Write(bytes, 0, bytes.Length);
            LastSentAt = Time.realtimeSinceStartup;
        }
        catch
        {
            TcpClient = null; // it will reconnect on the Update Loop
        }


    }

    private void ReceiveMessage(string json)
    {

        // examine the generic message
        var generic = JsonUtility.FromJson<Message>(json);
        Debug.Log($"received: {json}");

        // determine message and value
        if (generic.c == "helm")
        {
            var actual = JsonUtility.FromJson<Message<HelmPayload>>(json);
            Player.ApplyHelm(actual.p);
        }

        // take note of the last received message
        LastReceivedAt = Time.realtimeSinceStartup;

    }

    private void ReceiveData(string data)
    {
        var lines = data.Split('\n');
        for (int i = 0; i < lines.Length - 1; i++)
        {
            string json = Buffer + lines[i];
            ReceiveMessage(json);
            Buffer = string.Empty;
        }
        Buffer += lines[lines.Length - 1];
    }

    private void ReceiveBytes()
    {
        try
        {

            // see if there is data to process
            if (TcpClient == null) return;
            var stream = TcpClient.GetStream();
            if (!stream.DataAvailable) return;

            // get the bytes
            var buffer = new byte[4096];
            int len = stream.Read(buffer, 0, buffer.Length);
            if (len > 0)
            {

                // process the data
                string data = System.Text.Encoding.ASCII.GetString(buffer, 0, len);
                Debug.Log(data);
                ReceiveData(data);

            }
            else
            {

                // attempt to reconnect
                Debug.Log("need to reconnect");

            }

        }
        catch (Exception ex)
        {
            Debug.LogError(ex.Message);
        }
    }

    void Start()
    {

        // references
        Player = GameObject.Find("player").GetComponent<Player>();
        ConnectionLamp = GameObject.Find("ConnectionLamp").GetComponent<ConnectionLamp>();

    }

    void Update()
    {

        // try to connect if new or on error
        Elapsed += Time.deltaTime;
        if (TcpClient == null && Elapsed > 1.0f)
        {
            Elapsed = 0.0f;
            ConnectionLamp.SetLampColor("yellow");
            TcpClient = new TcpClient();
            TcpClientConnectTask = TcpClient.ConnectAsync("127.0.0.1", 5000);
        }

        // announce connection failure
        if (TcpClientConnectTask != null && TcpClientConnectTask.IsFaulted)
        {
            ConnectionLamp.SetLampColor("red");
            TcpClient = null;
            TcpClientConnectTask = null;
        }

        // announce connection success
        if (TcpClientConnectTask != null && TcpClientConnectTask.IsCompleted && !TcpClientConnectTask.IsFaulted)
        {
            ConnectionLamp.SetLampColor("green");
            TcpClientConnectTask = null;
            var msg = new Message<Client>()
            {
                c = "checkin",
                p = new Client() { id = "mainViewScreen" },
                e = 0
            };
            Send(msg);
        }

        // send keep-alive if there is no other traffic
        float maxIdle = Time.realtimeSinceStartup - 5;
        if (TcpClient != null && TcpClient.Connected && maxIdle > LastReceivedAt && maxIdle > LastSentAt)
        {
            var msg = new Message()
            {
                c = "keep-alive",
                e = 0
            };
            Send(msg);
        }

        // get messages
        if (TcpClient != null && TcpClient.Connected)
        {
            ReceiveBytes();
        }

    }
}
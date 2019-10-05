using System;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using UnityEngine;
using static Helm;

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
    public class ButtonClick
    {
        public string id;
    }

    [Serializable]
    public class TelemetryPayload
    {
        public float posx;
        public float posy;
        public float posz;
        public float rotx;
        public float roty;
        public float rotz;
    }

    private string Id { get; set; }
    private double Elapsed { get; set; }

    private TcpClient TcpClient { get; set; }
    private Task TcpClientConnectTask { get; set; }
    private string Buffer { get; set; }
    private float LastSentAt { get; set; }
    private float LastReceivedAt { get; set; }

    private Lamp ConnectionLamp { get; set; }
    private Helm Helm { get; set; }
    private Sensors Sensors { get; set; }

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
        if (generic.c == "telemetry")
        {
            var actual = JsonUtility.FromJson<Message<TelemetryPayload>>(json);
            if (Helm.isActiveAndEnabled) Helm.ReceiveTelemetry(actual.p);
            if (Sensors.isActiveAndEnabled) Sensors.ReceiveTelemetry(actual.p);
        }
        if (generic.c == "helm" && Helm.isActiveAndEnabled)
        {
            var actual = JsonUtility.FromJson<Message<FromHelmStation>>(json);
            Helm.ReceiveFromHelmStation(actual.p);
        }
        if (generic.c == "zone")
        {
            Sensors.ReceiveZone(json);
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
            Debug.LogError(ex.StackTrace);
        }
    }

    void Start()
    {

        // references
        ConnectionLamp = GameObject.Find("ConnectionLamp").GetComponent<Lamp>();
        Helm = Resources.FindObjectsOfTypeAll<Helm>().First();
        Sensors = Resources.FindObjectsOfTypeAll<Sensors>().First();

        // generate an id for this mobile app
        Id = Guid.NewGuid().ToString();

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
            TcpClientConnectTask = TcpClient.ConnectAsync("gameserver", 5000);
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
                p = new Client() { id = Id },
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
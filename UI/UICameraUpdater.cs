using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace LAOPLUS.UI
{
    public class UICameraUpdater : MonoBehaviour
    {
        // singleton
        public static UICameraUpdater Instance { get; private set; }

        public float updateInterval = 1.0f;
        List<UICamera> _uiCameras;
        float _timer;

        void Awake()
        {
            LAOPLUS.Log.LogDebug("UICameraUpdater: Awake");
            if (Instance != null)
            {
                Destroy(this);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(this);
        }

        void Start()
        {
            LAOPLUS.Log.LogDebug("UICameraUpdater: Start");
            this._uiCameras = new List<UICamera>();
            UpdateUICameraList();
        }

        void Update()
        {
            this._timer += Time.deltaTime;
            if (!(this._timer > this.updateInterval))
            {
                return;
            }

            UpdateUICameraList();
            this._timer = 0;
        }

        void UpdateUICameraList()
        {
            this._uiCameras = FindObjectsOfType<UICamera>().ToList();
            LAOPLUS.Log.LogDebug($"UICameraUpdater: UpdateUICameraList, {this._uiCameras.Count} cameras found");
        }

        public List<UICamera> GetUICameras()
        {
            // リストのコピーを返す
            return new List<UICamera>(this._uiCameras);
        }
    }
}

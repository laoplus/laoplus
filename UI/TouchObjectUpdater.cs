using System.Collections.Generic;
using System.Linq;
using HedgehogTeam.EasyTouch;
using UnityEngine;

namespace LAOPLUS.UI
{
    public class TouchObjectUpdater : MonoBehaviour
    {
        // singleton
        public static TouchObjectUpdater Instance { get; private set; }

        public float updateInterval = 1.0f;
        List<MonoBehaviour> _objects;
        float _timer;

        void Awake()
        {
            LAOPLUS.Log.LogDebug("TouchObjectUpdater: Awake");
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
            LAOPLUS.Log.LogDebug("TouchObjectUpdater: Start");
            this._objects = new List<MonoBehaviour>();
            UpdateObjectsList();
        }

        void Update()
        {
            this._timer += Time.deltaTime;
            if (!(this._timer > this.updateInterval))
            {
                return;
            }

            UpdateObjectsList();
            this._timer = 0;
        }

        void UpdateObjectsList()
        {
            var cameras = FindObjectsOfType<UICamera>().ToList();
            var easyTouches = FindObjectsOfType<EasyTouch>().ToList();
            this._objects = cameras.Concat<MonoBehaviour>(easyTouches).ToList();
            LAOPLUS.Log.LogDebug(
                $"TouchObjectUpdater: UpdateObjectsList, {this._objects.Count} camera or easyTouches found."
            );
        }

        public List<MonoBehaviour> GetObjects()
        {
            // リストのコピーを返す
            return new List<MonoBehaviour>(this._objects);
        }
    }
}

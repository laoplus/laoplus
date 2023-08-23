using System.Collections.Generic;
using UnityEngine;

namespace LAOPLUS.UI;

internal class NavManager
{
    public enum Navigation
    {
        Config,
        About,
        Stats
    }

    Navigation _nav;

    readonly Dictionary<string, Vector2> _scrollPositions = new();

    // すべてのスクロール位置をリセットする
    void ResetScrollPos()
    {
        var keys = new List<string>(this._scrollPositions.Keys);
        foreach (var key in keys)
        {
            this._scrollPositions[key] = Vector2.zero;
        }
    }

    public Vector2 GetScrollPos(string id)
    {
        if (!this._scrollPositions.TryGetValue(id, out var scrollPos))
        {
            scrollPos = Vector2.zero;
            this._scrollPositions[id] = scrollPos;
        }
        return this._scrollPositions[id];
    }

    public void SetScrollPos(string id, Vector2 value)
    {
        this._scrollPositions[id] = value;
    }

    public Navigation Nav
    {
        get => this._nav;
        set
        {
            this._nav = value;
            ResetScrollPos();
        }
    }

    public GUIStyle GetNavButtonStyle(Navigation nav)
    {
        return nav == this._nav ? CustomSkin.NavButtonSelected : CustomSkin.NavButton;
    }
}

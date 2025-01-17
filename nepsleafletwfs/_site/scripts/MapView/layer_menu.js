﻿// this is the layers control plugin code


L.Control.GroupedLayers = L.Control.extend({
    options: {
        collapsed: !0,
        position: "topright",
        autoZIndex: 0,
        exclusiveGroups: [],
        groupCheckboxes: !1
    },
    initialize: function (a, b, c) {
        var d, e;
        L.Util.setOptions(this, c),
            this._layers = {},
            this._lastZIndex = 0,
            this._handlingClick = !1,
            this._groupList = [],
            this._domGroups = [];
        for (d in a) this._addLayer(a[d], d);
        for (d in b) for (var e in b[d]) this._addLayer(b[d][e], e, d, !0)
    },
    update: function () {

        // L.Util.setOptions(this, {collapsed: isCollapsed 


        if (this.options.collapsed) {
            this._expand();
            this.options.collapsed = !this.options.collapsed;
        }
        else {
            this.options.collapsed = !this.options.collapsed;
            this._collapse();
        }


        // this._initLayout();

        // alert(this.options.collapsed);
    },
    onAdd: function (a) {
        return this._initLayout(),
            this._update(),
            a.on("layeradd",
                this._onLayerChange,
                this).on("layerremove",
                    this._onLayerChange,
                    this),
            this._container
    },
    onRemove: function (a) {
        a.off("layeradd", this._onLayerChange).off("layerremove", this._onLayerChange)
    },
    addBaseLayer: function (a, b) {
        return this._addLayer(a, b), this._update(), this
    },
    addOverlay: function (a, b, c) {
        return this._addLayer(a, b, c, !0), this._update(), this
    },
    removeLayer: function (a) {
        var b = L.Util.stamp(a);
        alert("del "+b);
        return delete this._layers[b], this._update(), this
    },
    _initLayout: function () {
        var a = "leaflet-control-layers",
            b = this._container = L.DomUtil.create("div", a);
        b.setAttribute("aria-haspopup", !0),
            L.Browser.touch ? L.DomEvent.on(b, "click", L.DomEvent.stopPropagation) : (L.DomEvent.disableClickPropagation(b),
                L.DomEvent.on(b, "wheel", L.DomEvent.stopPropagation));
        var c = this._form = L.DomUtil.create("form", a + "-list");
        if (this.options.collapsed) {
            L.Browser.android || L.DomEvent.on(b, "mouseover", this._expand, this).on(b, "mouseout", this._collapse, this);
            var d = this._layersLink = L.DomUtil.create("a", a + "-toggle", b);
            d.href = "#",
                d.title = "Layers",
                L.Browser.touch ? L.DomEvent.on(d, "click", L.DomEvent.stop).on(d, "click", this._expand, this) : L.DomEvent.on(d, "focus", this._expand, this),
                this._map.on("click", this._collapse, this)
        } else this._expand();
        this._baseLayersList = L.DomUtil.create("div", a + "-base", c),
            this._separator = L.DomUtil.create("div", a + "-separator", c),
            this._overlaysList = L.DomUtil.create("div", a + "-overlays", c),
            b.appendChild(c)
    },
    _addLayer: function (a, b, c, d) {
        var e = L.Util.stamp(a);
        //alert("add "+b);
        this._layers[e] = { layer: a, name: b, overlay: d },
            c = c || "";
        var f = this._indexOf(this._groupList, c);
        -1 === f && (f = this._groupList.push(c) - 1);
        var g = -1 != this._indexOf(this.options.exclusiveGroups, c);
        this._layers[e].group = { name: c, id: f, exclusive: g },
            this.options.autoZIndex && a.setZIndex && (this._lastZIndex++, a.setZIndex(this._lastZIndex))
    },
    _update: function () {
        ////alert("_update ");

        if (this._container) {

            this._baseLayersList.innerHTML = "",
                this._overlaysList.innerHTML = "",
                this._domGroups.length = 0;
            var a, b, c = !1, d = !1;
            for (a in this._layers) b = this._layers[a],
                this._addItem(b),
                d = d || b.overlay,
                c = c || !b.overlay;
            this._separator.style.display = d && c ? "" : "none"
        }
    },
    _onLayerChange: function (a) {
        ////alert("onLayerChange");
        var b = this._layers[L.Util.stamp(a.layer)];

        if (b) {
            // alert(map.hasLayer(layer));
            ////alert(this._handlingClick);
            //UpdateBufferLayer();
            var lay_id = L.Util.stamp(a.layer);

            if (!this._handlingClick) {

                ////alert(lay_id);

                var f, g, k, m, kk, mm,
                    d = this._form.getElementsByTagName("input"),
                    e = d.length;
                ////alert(e);
                for (this._handlingClick = !0, f = 0; e > f; f++) {
                    g = d[f];
                    if ("leaflet-control-layers-selector" == g.className && lay_id == g.layerId && this._map.hasLayer(this._layers[g.layerId].layer) && !g.checked) {
                        ////alert(1);
                        g.checked = true;
                        for (k = 0; e > k; k++) {
                            m = d[k];
                            if ("leaflet-control-layers-group-selector" == m.className && m.groupID == g.groupID) {
                                m.checked = true;
                                break;
                            }
                        }

                    }
                    else if ("leaflet-control-layers-selector" == g.className && lay_id == g.layerId && !this._map.hasLayer(this._layers[g.layerId].layer) && g.checked) {
                        // //alert(2);
                        g.checked = false;
                        // alert(g.checked);

                        var ch = 1;
                        for (kk = 0; e > kk; kk++) {
                            mm = d[kk];
                            if ("leaflet-control-layers-selector" == mm.className && mm.groupID == g.groupID && mm.checked) {
                                ch = 0;
                                break;
                            }
                        }

                        // alert(ch);

                        for (k = 0; e > k; k++) {
                            m = d[k];
                            if ("leaflet-control-layers-group-selector" == m.className && m.groupID == g.groupID) {
                                m.checked = !ch;
                                break;
                            }
                        }


                    }
                }

                this._handlingClick = true;

            }

            this._handlingClick || this._update();
            var c = b.overlay ? "layeradd" === a.type ? "overlayadd" : "overlayremove" : "layeradd" === a.type ? "baselayerchange" : null;
            c && this._map.fire(c, b)




            this._handlingClick = false;
        }
    },
    _createRadioElement: function (a, b) {
        ////alert("createRadioElement");
        var c = '<input type="radio" class="leaflet-control-layers-selector" name="' + a + '"';
        b && (c += ' checked="checked"'), c += "/>";
        var d = document.createElement("div");
        return d.innerHTML = c, d.firstChild
    },
    _addItem: function (a) {
        var b, c,
            d = document.createElement("label"),
            e = this._map.hasLayer(a.layer);
        a.overlay ? a.group.exclusive ? (groupRadioName = "leaflet-exclusive-group-layer-" + a.group.id,
            b = this._createRadioElement(groupRadioName, e)) : (b = document.createElement("input"),
                b.type = "checkbox",
                b.checked = false,
                b.className = "leaflet-control-layers-selector",
                b.defaultChecked = e) : b = this._createRadioElement("leaflet-base-layers", e),
            b.layerId = L.Util.stamp(a.layer),
            b.groupID = a.group.id,
            L.DomEvent.on(b, "click", this._onInputClick, this);

        //anna add
        //  if (!a.group.exclusive) {
        //      this._map.addLayer(a.layer);
        //      legend.addLayer(a.layer);

        //  }


        var f = document.createElement("span");
        if (f.innerHTML = " " + a.name, d.appendChild(b), d.appendChild(f), a.overlay) {
            c = this._overlaysList;
            var g = this._domGroups[a.group.id];
            if (!g) {
                g = document.createElement("div"),
                    g.className = "leaflet-control-layers-group",
                    g.id = "leaflet-control-layers-group-" + a.group.id;
                var h = document.createElement("label");
                if (h.className = "leaflet-control-layers-group-label",
                    "" != a.group.name && !a.group.exclusive && this.options.groupCheckboxes) {
                    var i = document.createElement("input");
                    i.type = "checkbox",
                        i.checked = false,
                        i.className = "leaflet-control-layers-group-selector",
                        i.groupID = a.group.id,
                        i.legend = this, L.DomEvent.on(i, "click", this._onGroupInputClick, i),
                        h.appendChild(i)
                }
                var j = document.createElement("span");
                j.className = "leaflet-control-layers-group-name",
                    j.innerHTML = a.group.name,
                    h.appendChild(j),
                    g.appendChild(h),
                    c.appendChild(g),
                    this._domGroups[a.group.id] = g
            } c = g
        } else c = this._baseLayersList;
        return c.appendChild(d), d
    },
    _onGroupInputClick: function () {

        var a, b, c;
        this_legend = this.legend,
            this_legend._handlingClick = !0;
        var d = this_legend._form.getElementsByTagName("input"),
            e = d.length;
        for (a = 0; e > a; a++)
            b = d[a],
                b.groupID == this.groupID && "leaflet-control-layers-selector" == b.className && (b.checked = this.checked,
                    c = this_legend._layers[b.layerId],
                    b.checked && !this_legend._map.hasLayer(c.layer) ? this_legend._map.addLayer(c.layer) : !b.checked && this_legend._map.hasLayer(c.layer) && this_legend._map.removeLayer(c.layer));
        this_legend._handlingClick = !1
    },
    _onInputClick: function () {
        var a, b, c,
            d = this._form.getElementsByTagName("input"),
            e = d.length;
        for (this._handlingClick = !0, a = 0; e > a; a++)
            b = d[a],
                "leaflet-control-layers-selector" == b.className && (c = this._layers[b.layerId],
                    b.checked && !this._map.hasLayer(c.layer) ? this._map.addLayer(c.layer) : !b.checked && this._map.hasLayer(c.layer) && this._map.removeLayer(c.layer));
        this._handlingClick = !1
    },
    _expand: function () {
        if (this.options.collapsed)
            L.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
    },
    _collapse: function () {
        if (this.options.collapsed)
            this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
    },
    _indexOf: function (a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            if (a[c] === b)
                return c;
        return -1
    }
}),
    L.control.groupedLayers = function (a, b, c) {
        return new L.Control.GroupedLayers(a, b, c)
    }; 
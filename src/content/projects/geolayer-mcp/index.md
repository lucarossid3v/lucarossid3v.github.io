---
title: 'GeoLayer MCP'
description: 'Open-source MCP server, built on FastAPI, that gives AI assistants curated, read-only access to your geospatial layers through ten predefined spatial operations.'
date: 2026-09-29
category: 'AI Tools'
tags: ['mcp', 'ai', 'geospatial', 'gis', 'python', 'fastapi']
repoUrl: 'https://github.com/lucarossid3v/geolayer-mcp'
emoji: '🗺️'
featured: true
---

GeoLayer MCP is an open-source [MCP](https://modelcontextprotocol.io) server that lets AI assistants answer geographic questions from your own data. It exposes curated, read-only geospatial layers (GeoPackage, GeoJSON and raster elevation models) through ten predefined operations, so questions like "In which municipality is Monte Tamaro?" are answered by real spatial queries instead of guesses.

**Status:** v0.2, alpha. It is not on PyPI yet, so you install it from a clone of the repository. Licensed under Apache 2.0.

## The problem

Simple geographic questions often still need someone who can use a GIS or write a spatial query. AI assistants could answer them, but they do not know your data and, when pushed, they invent coordinates and results. Connecting an assistant straight to a database does not fix it either: the data owner needs to control what the assistant can see and do, and to check afterwards what it asked.

## Principles

- **Curated.** You choose which layers and which attributes the assistant can see, for example hiding owners' personal data.
- **Predefined operations only.** No free-form queries, no code execution, no writes.
- **Traceable.** Every call goes to an audit log with the API key that made it, and every answer carries its provenance: operation, source, parameters and attribution.
- **Just files.** A YAML file and a GeoPackage, GeoJSON or GeoTIFF are enough. No database, no GIS server.

## Tools

| Tool                | Answers questions like                      |
| ------------------- | ------------------------------------------- |
| `list_layers`       | What data can I ask about?                  |
| `describe_layer`    | Which attributes does this layer have?      |
| `search_features`   | Find the places whose name contains "Ronco" |
| `locate_point`      | In which municipality is this point?        |
| `find_nearby`       | Which places are within 2 km of Ascona?     |
| `find_intersecting` | Which municipalities does the river cross?  |
| `measure`           | How large is Lugano?                        |
| `get_elevation`     | At what elevation is Ascona?                |
| `elevation_profile` | How much do I climb along this road?        |
| `terrain_stats`     | How much of Gambarogno is steeper than 30°? |

The last three work on raster elevation layers and read only the cells they need, never the whole raster.

## Try it

The repository includes a complete demo on Swiss open data from swisstopo: the municipalities, districts and place names of Canton Ticino, plus a 2 m terrain model. You need [uv](https://docs.astral.sh/uv/getting-started/installation/).

```sh
git clone https://github.com/lucarossid3v/geolayer-mcp.git
cd geolayer-mcp
uv sync
uv run python examples/ticino-demo/prepare_data.py
uv run geolayer-mcp validate-config examples/ticino-demo/geolayer.yaml
```

Then connect an MCP client such as Claude Desktop. The [README](https://github.com/lucarossid3v/geolayer-mcp#connect-an-mcp-client) covers client setup, Docker, configuration and the optional REST API.

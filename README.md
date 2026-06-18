live link: https://property-insights-api.vercel.app

Property Intelligence Platform

A full-stack application that aggregates property assessment data from publicly available county property records into a single modern interface.

Overview

Property information is often spread across multiple pages and data views, requiring users to manually navigate between property details, taxpayer information, sales history, assessment records, and other datasets.

This project provides a unified interface that allows users to:

Search properties using a Parcel ID (PIN)
View property profile information
Access taxpayer information
Review sales history
Consolidate data from multiple property record endpoints
Explore property information through a modern React-based interface

Technical Highlights

Frontend
React
Axios
Modern component-based architecture

Backend
Node.js
Express.js
Cheerio for HTML parsing
Axios for data retrieval

How It Works

User enters a Parcel ID.
Backend retrieves property information from multiple public property record endpoints.
Data is parsed and normalized into a structured JSON format.
Frontend presents the information in a single consolidated view.

Architecture

User
 ↓
React Frontend
 ↓
Node.js API
 ↓
Property Record Endpoints
 ↓
HTML Parsing & Data Extraction
 ↓
Unified JSON Response

Purpose

This project was built as an exploration of:
Government data systems
Property assessment workflows
Data aggregation
Reverse engineering publicly accessible web applications
Building developer-friendly APIs on top of legacy systems

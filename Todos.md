# Todos

## Prep

    - Decide on graph ui library
    - Look into cumulative exposure metrics in past research

## Design

    - Time series component
        - Resident view:
            -
    - Dashboard page
    - Radial component

## Front End

    - Export feature

## Back End

    -

just get to here

front end has file names and a click from user -> file name request ->

# Current Implementation Status

### ✅ Implemented

- FastAPI app with CORS
- Sensor test endpoint
- Basic sensor data endpoint
- Pydantic models for request/response
- Sensor validation service
- Frontend TypeScript API client
- Mock data responses

### 🚧 In Progress

- CSV data loading from files
- Actual data aggregation logic
- Statistics calculation

### 📋 TODO

- Read actual CSV data
- Implement time range filtering
- Calculate real statistics
- Error handling and validation
- Rate limiting
- Authentication (if needed)
- Caching layer
- Database integration (if needed)

---

## Notes

### Known Issues

1. **Sensor IDs with `.csv` extension**: The current sensor IDs include `.csv` which causes 404 errors. Consider:

   - Using `/{sensor_id:path}` to accept dots in path
   - Or removing `.csv` from sensor IDs entirely

2. **Relative Paths**: The `sensor_service.py` uses relative paths (`../data/`) which may not work correctly. Use absolute paths with `Path(__file__).parent`.

3. **Models not in docs**: Ensure routes are using `response_model` parameter and server is restarted after changes.

### Recommendations

- Remove `.csv` from sensor_id values
- Use absolute paths for file access
- Add comprehensive error handling
- Implement logging
- Add request validation
- Consider pagination for large datasets

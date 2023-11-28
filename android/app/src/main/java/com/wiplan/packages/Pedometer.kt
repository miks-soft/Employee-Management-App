package com.Employee Management App.packages

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class Pedometer : ReactContextBaseJavaModule, SensorEventListener {
    private var mReactContext: ReactApplicationContext

    private var mSensorManager: SensorManager
    private var stepsAtTheBeginning: Int? = null
    private lateinit var mStepCounter: Sensor

    constructor(reactContext: ReactApplicationContext) : super(reactContext) {
        mReactContext = reactContext
        mSensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    }

    override fun getName(): String {
        return "SimplePedometer"
    }

    @ReactMethod
    fun start() {
        stepsAtTheBeginning = null
        mStepCounter = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

        if (mStepCounter !== null) {
            mSensorManager.registerListener(this, mStepCounter, SensorManager.SENSOR_DELAY_FASTEST)
        }
    }

    @ReactMethod
    fun stop() {
        stepsAtTheBeginning = null
        mSensorManager.unregisterListener(this)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: RuntimeException) {
            Log.e(
                "ERROR",
                "java.lang.RuntimeException: Trying to invoke JS before CatalystInstance has been set!"
            )
        }
    }

    override fun onSensorChanged(sensorEvent: SensorEvent) {
        if (sensorEvent.sensor.type !== Sensor.TYPE_STEP_COUNTER) {
            return
        }

        if (stepsAtTheBeginning == null) {
            stepsAtTheBeginning = sensorEvent.values[0].toInt() - 1
        }

        val map = Arguments.createMap()

        map.putDouble("steps", (sensorEvent.values[0] - stepsAtTheBeginning!!).toDouble())

        sendEvent("onStepReceive", map)
    }

    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {}
}
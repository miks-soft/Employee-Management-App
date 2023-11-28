package com.Employee Management App.packages;


import android.annotation.TargetApi;
import android.app.AppOpsManager;
import android.app.Activity.*;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.Employee Management App.MainActivity;


public class UsageStatsModule extends ReactContextBaseJavaModule {
    // Result Java Script object
    static final String JS_OBJ_SUCCESS = "success";
    static final String JS_OBJ_EVENTS = "events";
    static final String JS_OBJ_PACKAGE_NAME = "packageName";
    static final String JS_OBJ_APP_NAME = "appName";
    static final String JS_OBJ_APP_TYPE = "appType";
    static final String JS_OBJ_TIME_STAMP = "timeStamp";
    static final String JS_OBJ_EVENT_TYPE = "eventType";
    // Application types
    static final String APP_TYPE_UPDATED_SYSTEM = "updated-system";
    static final String APP_TYPE_SYSTEM = "system";
    static final String APP_TYPE_USER_INSTALLED = "user-installed";
    Context context;
    AppOpsManager appOpsManager;

    private static final String TAG = "UsageStatsModule";

    public UsageStatsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext.getApplicationContext();
        this.appOpsManager = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);

        String packageName = context.getApplicationContext().getPackageName();
    }

    @ReactMethod
    private void checkPermission(final Promise promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            promise.resolve(true);
            return;
        }

        int mode = appOpsManager.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getApplicationContext().getPackageName());

        promise.resolve(mode == AppOpsManager.MODE_ALLOWED);
    }

    @ReactMethod
    private void requestPermission() {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }


    @Override
    public String getName() {
        return "UsageStats";
    }

    private String getApplicationType(ApplicationInfo appInfo) {
        if ((appInfo.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0) {
            return APP_TYPE_UPDATED_SYSTEM;

        } else if ((appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
            return APP_TYPE_SYSTEM;

        } else {
            return APP_TYPE_USER_INSTALLED;
        }
    }

    private ApplicationInfo getApplicationInfo(String packageName) {
        PackageManager packageManager = this.context.getPackageManager();
        try {
            return packageManager.getApplicationInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            return null;
        }
    }


    @ReactMethod
    public void getUsageEventList(double beginTime, double endTime, Callback callback) {
        WritableMap resultData = new WritableNativeMap();
        WritableArray events = new WritableNativeArray();

        UsageStatsManager usageStatsManager = (UsageStatsManager) this.context.getSystemService(Context.USAGE_STATS_SERVICE);
        PackageManager packageManager = this.context.getPackageManager();

        UsageEvents usageEvents = usageStatsManager.queryEvents((long) beginTime, (long) endTime);

        if (usageEvents != null) {
            while (usageEvents.hasNextEvent()) {
                UsageEvents.Event event = new UsageEvents.Event();
                usageEvents.getNextEvent(event);
                double timeStamp = (double) event.getTimeStamp();
                int eventType = event.getEventType();
                String packageName = event.getPackageName();
                if (eventType == UsageEvents.Event.ACTIVITY_RESUMED || eventType == UsageEvents.Event.ACTIVITY_PAUSED || eventType == UsageEvents.Event.ACTIVITY_STOPPED) {
                    WritableMap data = new WritableNativeMap();
                    ApplicationInfo appInfo = getApplicationInfo(packageName);
                    if (appInfo != null) {
                        String appName = (String) packageManager.getApplicationLabel(appInfo);
                        String appType = getApplicationType(appInfo);

                        data.putString(JS_OBJ_PACKAGE_NAME, packageName);
                        data.putString(JS_OBJ_APP_NAME, appName);
                        data.putString(JS_OBJ_APP_TYPE, appType);
                        data.putDouble(JS_OBJ_TIME_STAMP, timeStamp);
                        data.putInt(JS_OBJ_EVENT_TYPE, eventType);

                        events.pushMap(data);
                    }
                }
            }

            resultData.putBoolean(JS_OBJ_SUCCESS, true);
        } else {
            resultData.putBoolean(JS_OBJ_SUCCESS, false);
        }

        resultData.putArray(JS_OBJ_EVENTS, events);
        callback.invoke(resultData);
    }
}
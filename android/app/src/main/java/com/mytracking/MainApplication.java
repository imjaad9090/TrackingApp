package com.mytracking;

import android.app.Application;
//import com.surialabs.rn.geofencing.GeoFencingPackage;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.surialabs.rn.geofencing.GeoFencingPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.oblador.vectoricons.VectorIconsPackage;
import ca.bigdata.voice.contacts.BDVSimpleContactsPackage;
import com.mustansirzia.fused.FusedLocationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
//import com.lwhiteley.reactnativecontactpicker.RNContactPicker; 

import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new RNDeviceInfo(),
            new GeoFencingPackage(),
            new RNSpinkitPackage(),
            new ReactNativeContacts(),
            new VectorIconsPackage(),
            new BDVSimpleContactsPackage(),
            new FusedLocationPackage(),
           new MapsPackage(),
           new FIRMessagingPackage()


      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

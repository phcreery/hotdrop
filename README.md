# hotdrop

Hotspot - Airdrop

Share any file from anywhere. No need for a WIFI connection, Mobile Connection, LTE, Bluetooth, etc.

Built for a Raspberry Pi Zero W.

## System Setup

Install dependencies

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install git usbmount
cd ~
git clone https://github.com/phcreery/hotdrop
```

Fix `usbmount` for debian buster:

```
sudo systemctl edit systemd-udevd
```

add

```
[Service]
PrivateMounts=no
```

Edit `/etc/usbmount/usbmount.conf` and change `FILESYSTEMS` line to

```
FILESYSTEMS="vfat ext2 ext3 ext4 hfsplus fuseblk exfat"
```

Install node.js using these instructions: https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/
Then install more dependencies.

```
npm install -g serve pm2
```

Serve will be our simple static file server for the client-side code. PM2 will be the node.js process manager.

Install project dependencies and start the instances.

```
cd ~/hotdrop/client
npm install
sudo pm2 start serve --name client -- -s dist -l 80 -C

cd ~/hotdrop/server
sudo pm2 start npm --name server -- start
npm install
```

You should be able to reach the system at http://raspberrypi.local

## Hotspot setup

http://www.intellamech.com/RaspberryPi-projects/rpi3_simple_wifi_ap.html

## SSH over USB

Edit `/boot/config.txt`
Add line to end of file:

```
dtoverlay=dwc2
```

Edit `/boot/cmdline.txt`
Append after `rootwait` a space and then:

```
modules-load=dwc2,g_ether
```

If you have SSH over USB configured, be sure put the usb port back in host mode when done so the USB device can be read.

Edit `/boot/config.txt` and change to

```
dtoverlay=dwc2,dr_mode=host
```

## Debug

#### JS

```
pm2 logs
```

#### USB automount

```
dmesg | egrep 'usb|scsi|sd[a-z]'
cat /var/log/syslog | grep usbmount
```

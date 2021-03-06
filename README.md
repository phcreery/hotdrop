# hotdrop

Hotspot + Airdrop = hotdrop

Share any file from anywhere. No need for a WIFI connection, Mobile Connection, LTE, Bluetooth, etc.

Built and tested on a Raspberry Pi Zero W.

![LIT_9161.jpg](case/LIT_9161.jpg)

## Raspberry Pi System Setup

Install dependencies

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install git usbmount
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

### Hotspot setup

http://www.intellamech.com/RaspberryPi-projects/rpi3_simple_wifi_ap.html

### SSH over USB

Edit `/boot/config.txt` on system SD card.
Add line to end of file:

```
dtoverlay=dwc2
```

Edit `/boot/cmdline.txt`
Append after `rootwait` a space and then:

```
modules-load=dwc2,g_ether
```

You will now be able to SSH your pi over USB connection at `raspberry@raspberrypi.local`

If you have SSH over USB configured, be sure put the usb port back in host mode when you are done so that USB devices can be read.

Edit `/boot/config.txt` and add `,dr_mode=host` after `dtoverlay`

```
dtoverlay=dwc2,dr_mode=host
```

## Installation

Install node.js using these instructions: https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/

```
npm install -g serve pm2
```

**Serve** will be our simple static file server for the client-side code. **PM2** will be the node.js process manager.

Install project dependencies and start the instances.

```
cd ~
git clone https://github.com/phcreery/hotdrop
cd ~/hotdrop/client
npm install
sudo pm2 start serve --name client -- -s dist -l 80 -C

cd ~/hotdrop/server_node
sudo pm2 start npm --name server -- start
npm install
```

You should be able to reach the system at http://raspberrypi.local

## Debug

#### JS

```
pm2 ls
pm2 logs
```

#### USB automount

```
dmesg | egrep 'usb|scsi|sd[a-z]'
cat /var/log/syslog | grep usbmount
```

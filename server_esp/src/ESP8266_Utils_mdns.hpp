void InitMDNS()
{
   if (!MDNS.begin(hostname)) 
   {             
     Serial.println("Error initiating mDNS");
   }
   Serial.println("mDNS initiated");
}
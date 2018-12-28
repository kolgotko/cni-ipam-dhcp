usage:

create file dhcp.conf:
```json
{
    "cniVersion": "0.3.1",
    "name": "network",
    "type": "dhcp"
}
```

execute command in shell:
```sh
% sudo cat dhcp.conf | sudo env CNI_COMMAND="ADD" CNI_CONTAINERID=1 CNI_IFNAME=eth0 CNI_PATH=`pwd` ./index.js | jq
```

similar output:
```json
{
  "cniVersion": "0.3.1",
  "ips": [
    {
      "version": "4",
      "address": "192.168.0.143/24",
      "gateway": "192.168.0.1",
      "interface": 0
    }
  ],
  "routes": [],
  "dns": {
    "nameservers": [
      "192.168.0.1"
    ],
    "domain": "websm.io"
  }
}
```

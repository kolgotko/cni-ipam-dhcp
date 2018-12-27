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

`% sudo cat dhcp.conf | sudo env CNI_COMMAND="ADD" CNI_CONTAINERID=1 CNI_IFNAME=eth0 CNI_PATH=`pwd` ./index.js | jq`

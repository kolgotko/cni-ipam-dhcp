#!/usr/bin/env node

'use strict';

const {spawn, spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

async function getStdinData() {

    return new Promise((res, rej) => {

        let returnData = '';
        let dataHandler = data => { returnData += data; };

        process.stdin.on('data', dataHandler);
        process.stdin.on('end', _ => {
            process.stdin.removeListener('data', dataHandler);
            res(returnData);
        });

    });

}

async function cmdAdd(envData, stdinData) {

    let containerId = envData.CNI_CONTAINERID;
    let ifName = envData.CNI_IFNAME;

    spawnSync('jexec', [
        containerId, "ifconfig", ifName, "inet", "0.0.0.0", "up"
    ]);

    let result = spawnSync('dhclient-cni', [], {
        input: JSON.stringify({
            iface: ifName,
            jid: parseInt(containerId),
        }),
    });

    if (!result.status) {

        let dhcp = JSON.parse(result.stdout);
        let data = {
            cniVersion: "0.3.1",
            ips: [
                {
                    version: "4",
                    address: dhcp.ip_cidr,
                    gateway: dhcp.router,
                },
            ],
            routes: [],
            dns: {
                nameservers: [ dhcp.options.nameserver ],
                domain: dhcp.options.domain,
            }
        };

        console.log(JSON.stringify(data));

    } else {

        let output = JSON.parse(result.stdout);
        let data = {
            "cniVersion": "0.3.1",
            "code": result.status,
            "msg": output.msg,
        };

        console.log(JSON.stringify(data));
        process.exit(1);

    }

}

async function cmdDel(envData, stdinData) {

    let containerId = envData.CNI_CONTAINERID;
    let ifName = envData.CNI_IFNAME;

}

// main
(async _ => {

    let defaults = {
        cniVersion: '0.3.1',
        name: '',
        type: 'dhcp',
    };

    let envData = process.env;
    let command = envData.CNI_COMMAND;

    let stdinData = JSON.parse(await getStdinData());
    stdinData = Object.assign({}, defaults, stdinData);

    switch (command) {
        case 'ADD':
            await cmdAdd(envData, stdinData);
            break;
        case 'DEL':
            await cmdDel(envData, stdinData);
            break;
    }

})();

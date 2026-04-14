/*
 * Copyright (C) 2018-2026 Modding Craft ZBD Studio.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

package top.techmczs.cuitxcpctool.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import top.techmczs.cuitxcpctool.common.RequiredConfig;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@ConfigurationProperties(prefix = "settings")
@Data
public class ToolProperties {

    @RequiredConfig
    private String domjudgeHost;
    @RequiredConfig
    private int domjudgePort;
    @RequiredConfig
    private String domjudgeContestId;
    @RequiredConfig
    private String domjudgePrintToken;
    @RequiredConfig
    private String domjudgeRoutePath;
    @RequiredConfig
    private String domjudgeAccount;
    @RequiredConfig
    private String domjudgePassword;

    @RequiredConfig
    private boolean useSpecialClient;
    @RequiredConfig
    private String specialClientUserAgent;
    @RequiredConfig
    private String nginxVerifyRoutePath;

    @RequiredConfig
    private int unfreezeBoardTime;
    @RequiredConfig
    private boolean shouldForbiddenOnlinePrint;
    @RequiredConfig
    private String onlineLocationKey;

    public String getAuth(){
        return domjudgeAccount + ":" + domjudgePassword;
    }

    public String getBaseUrl(){
        return this.domjudgeHost + ":" + this.domjudgePort + domjudgeRoutePath;
    }

    public String getBasicAuth(){
        return "Basic " + Base64.getEncoder().encodeToString(this.getAuth().getBytes(StandardCharsets.UTF_8));
    }
    public String getVerifyUrl(){
        return this.domjudgeHost + ":" + this.domjudgePort + this.nginxVerifyRoutePath;
    }

}

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

package top.techmczs.cuitxcpctool.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import top.techmczs.cuitxcpctool.entity.domjudge.*;
import top.techmczs.cuitxcpctool.properties.DomjudgeProperties;
import top.techmczs.cuitxcpctool.services.DomjudgeFetchService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DomjudgeFetchServiceImpl implements DomjudgeFetchService {

    private final RestTemplate restTemplate;

    private final DomjudgeProperties domjudgeProperties;

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", domjudgeProperties.getBasicAuth());
        return headers;
    }

    private String getUrl(String path) {
        return domjudgeProperties.getBaseUrl() + "/api/v4/contests/" + domjudgeProperties.getContestId() + path;
    }

    @Override
    public DjContest getContest() {
        return restTemplate.exchange(
                getUrl(""),
                HttpMethod.GET,
                new HttpEntity<>(getHeaders()),
                DjContest.class
        ).getBody();
    }

    @Override
    public List<DjProblem> getProblems() {
        return restTemplate.exchange(
                getUrl("/problems"),
                HttpMethod.GET,
                new HttpEntity<>(getHeaders()),
                new ParameterizedTypeReference<List<DjProblem>>() {}
        ).getBody();
    }

    @Override
    public List<DjTeam> getTeams() {
        return restTemplate.exchange(
                getUrl("/teams"),
                HttpMethod.GET,
                new HttpEntity<>(getHeaders()),
                new ParameterizedTypeReference<List<DjTeam>>() {}
        ).getBody();
    }

    @Override
    public List<DjSubmission> getSubmissions() {
        return restTemplate.exchange(
                getUrl("/submissions"),
                HttpMethod.GET,
                new HttpEntity<>(getHeaders()),
                new ParameterizedTypeReference<List<DjSubmission>>() {}
        ).getBody();
    }

    @Override
    public List<DjJudgement> getJudgements() {
        return restTemplate.exchange(
                getUrl("/judgements"),
                HttpMethod.GET,
                new HttpEntity<>(getHeaders()),
                new ParameterizedTypeReference<List<DjJudgement>>() {}
        ).getBody();
    }
}

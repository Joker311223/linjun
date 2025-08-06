package com.yin.yin.common;

import lombok.Data;

/**
 * 分页请求参数
 */
@Data
public class PageRequest {
    /**
     * 当前页码
     */
    private Integer pageNum = 1;

    /**
     * 每页数量
     */
    private Integer pageSize = 10;
}
